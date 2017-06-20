using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.App
{
    public class EntityController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel>
        where TEntity : BaseEntity, IEntityWithDetails<TEntityDetail>
        where TEntityDetail : BaseEntityDetail, new()
        where TFormDetailViewModel : class, new()
    {
        public CoreInDbContext DbContext { get; }
        private readonly IMediaHelper _mediaHelper;

        private readonly IStringLocalizer<TLocalizer> _localizer;
        private readonly IOptions<RequestLocalizationOptions> _localizationOptions;

        public IEntityHelper<TEntity, TEntityDetail> EntityHelper { get; }

        public EntityController(CoreInDbContext dbContext,
            IEntityHelper<TEntity, TEntityDetail> fieldEntityHelper,
            IMediaHelper mediaHelper,
            IStringLocalizer<TLocalizer> localizer,
            IOptions<RequestLocalizationOptions> localizationOptions)
        {
            DbContext = dbContext;
            EntityHelper = fieldEntityHelper;
            EntityHelper.SetContext(dbContext);
            _mediaHelper = mediaHelper;
            _localizer = localizer;
            _localizationOptions = localizationOptions;
        }

        public string GetLocalizationString(string sourceString)
            => _localizer[sourceString];

        /// <summary>
        /// Get an entity view model by name
        /// </summary>
        /// <param name="entityName">Name of entity</param>
        /// <param name="language">Language of requested form client</param>
        /// <returns></returns>
        public FormValues<TFormDetailViewModel> GetEntityValues(string entityName, string language)
        {
            var entity = EntityHelper.Entity(entityName);
            return this.GetEntityValues(entity.Id, language);
        }

        public FormValues<TFormDetailViewModel> GetEntityValues(long entityId, string language)
        {
            var result = new FormValues<TFormDetailViewModel>();
            var entity = EntityHelper.Entity(entityId);

            var details = EntityHelper.GetDetails(entity, language).ToList();
            var localizationFieldNames = details.Where(o => o.Language != null).Select(o => o.Field);
            var localizationFilteredDetails = details.AsEnumerable().Where(o => !(localizationFieldNames.Contains(o.Field) && o.Language == null)).ToList();

            //kiểm tra Detail trong list có móc vào file(chứa "Suffix" == "url")
            //thêm các Detail vào list để bổ sung chi tiết(dimension, size,..etc)
            var tempDetails = new List<TEntityDetail>();
            foreach (var detail in localizationFilteredDetails.Where(o => o.Suffix == AppKey.FileUrlPropertyName))
            {
                var fileEntity = _mediaHelper.Entity(detail.Value, true);
                if (fileEntity != null)
                    foreach (var fileDetail in fileEntity.Details)
                    {
                        if (fileDetail.Field == AppKey.FileUrlPropertyName)
                            continue;

                        var tempDetail = detail.Clone() as TEntityDetail;
                        tempDetail.Suffix = fileDetail.Field;
                        tempDetail.Value = fileDetail.Value;

                        tempDetails.Add(tempDetail);
                    }
            }
            localizationFilteredDetails.AddRange(tempDetails);

            result.Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } };
            result.Details = FormUtitities.EntityDetailsToFieldValues<TEntityDetail, TFormDetailViewModel>(localizationFilteredDetails);

            return result;
        }

        public DynamicForm<FormValues<TFormDetailViewModel>> GetForm(long? entityId, string requestLanguage = null)
        {
            var formInputLanguage = requestLanguage ?? _localizationOptions.Value.DefaultRequestCulture.Culture.Name;

            var form = new DynamicForm<FormValues<TFormDetailViewModel>>
            {
                Title = _localizer["Create a new"],
                Details = FormUtitities.ViewModelTypeToFormField(typeof(TFormDetailViewModel), _localizer),

            };

            if (entityId != null)
            {
                form.Title = _localizer["Update"];
                form.Languages = _localizationOptions.Value.SupportedUICultures.ToDictionary(c => c.Name, c => c.NativeName);
                form.RequestLanguage = formInputLanguage;

                form.InitialValues = this.GetEntityValues(entityId ?? 0, formInputLanguage);
            }

            if (form.InitialValues != null)
                form.InitialValues.Language = formInputLanguage;
            else
                form.InitialValues = new FormValues<TFormDetailViewModel>()
                {
                    Language = formInputLanguage
                };

            return form;
        }

        public IEnumerable<TEntity> GetRandomEntities(int count)
        {
            var entities = EntityHelper.Entities().OrderBy(o => Guid.NewGuid()).Take(count);
            return entities;
        }

        public virtual IEnumerable<TEntity> GetEntities(DataRequest dataRequest)
        {
            var entities = EntityHelper.Entities();

            var filterResult = entities;

            if (dataRequest.Filtering != null)
                foreach (var filtering in dataRequest.Filtering)
                {
                    if (filtering.Operator != null)
                    {
                        if (filtering.Operator == "==")
                            filterResult = filterResult.Where(o => o.Details.FirstOrDefault(e => e.Field == filtering.Id && e.Value == filtering.Value) != null);
                        else
                        {
                            var intValue = int.Parse(filtering.Value);

                            switch (filtering.Operator)
                            {
                                case "<":
                                    filterResult = filterResult.Where(o => o.Details.FirstOrDefault(e => e.Field == filtering.Id && e.Value != null && int.Parse(e.Value) < intValue) != null);
                                    break;
                                case "<=":
                                    filterResult = filterResult.Where(o => o.Details.FirstOrDefault(e => e.Field == filtering.Id && e.Value != null && int.Parse(e.Value) <= intValue) != null);
                                    break;
                                case ">=":
                                    filterResult = filterResult.Where(o => o.Details.FirstOrDefault(e => e.Field == filtering.Id && e.Value != null && int.Parse(e.Value) >= intValue) != null);
                                    break;
                                case ">":
                                    filterResult = filterResult.Where(o => o.Details.FirstOrDefault(e => e.Field == filtering.Id && e.Value != null && int.Parse(e.Value) > intValue) != null);
                                    break;
                                default:
                                    continue;
                            }
                        }
                    }
                    else
                        filterResult = filterResult.Where(o => o.Details.FirstOrDefault(e => e.Field == filtering.Id && e.Value.Contains(filtering.Value)) != null);
                }

            if (dataRequest.Sorted != null)
            {
                foreach (var sorting in dataRequest.Sorted)
                {
                    if (sorting.DESC)
                        filterResult = sorting.DESC ? filterResult.OrderByDescending(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value)
                            : filterResult.OrderBy(o => o.Details.FirstOrDefault(d => d.Field == sorting.Id).Value);
                }
            }
            if (dataRequest.Page == 0)
                dataRequest.Page = 1;

            filterResult = filterResult.Skip((dataRequest.Page - 1) * dataRequest.PageSize);
            filterResult = filterResult.Take(dataRequest.PageSize);

            return filterResult;
        }

        public TEntity Create(TEntity newEntity, IEnumerable<TEntityDetail> details, User user = null)
        {
            newEntity.Name = EntityHelper.GenerateEntityName(newEntity.Name);

            var entity = EntityHelper.Add(newEntity, user);
            if (details != null)
                EntityHelper.CreateDetails(entity, details, user);

            Save();

            return entity;
        }

        public int Update(long entityId, IEnumerable<TEntityDetail> details, User user = null)
        {
            var entity = EntityHelper.Entity(entityId);
            entity.Name = EntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value, entity.Id);

            EntityHelper.UpdateDetails(entity, details, user);

            return Save();
        }

        public int Deletes(long[] ids)
        {
            foreach (var id in ids)
            {
                var entity = EntityHelper.Entity(id);
                EntityHelper.Delete(entity);
            }

            return Save();
        }

        public virtual IEnumerable<BaseEntityViewModel> ToViewModels(IEnumerable<TEntity> entities, string[] moreFields = null)
        {
            foreach (var entity in entities)
            {
                var details = EntityHelper.GetDetails(entity);
                var viewModel = new BaseEntityViewModel()
                {
                    Title = details.FirstOrDefault(o => o.Field == "title")?.Value,
                };
                viewModel.SetId(entity.Id);
                viewModel.SetName(entity.Name);
                viewModel.SetThumbnail(details.FirstOrDefault(o => o.Field == "thumbnail" && o.Suffix == AppKey.FileUrlPropertyName)?.Value);
                if(moreFields != null)
                    foreach (var field in moreFields)
                    {
                        var objectDetailValue = details.FirstOrDefault(o => o.Field == field)?.Value;
                        if(objectDetailValue != null)
                            viewModel.SetMoreDetail(field, details.FirstOrDefault(o => o.Field == field).Value);
                    }

                yield return viewModel;
            }
        }

        public int Save()
            => DbContext.SaveChanges();
    }
}
