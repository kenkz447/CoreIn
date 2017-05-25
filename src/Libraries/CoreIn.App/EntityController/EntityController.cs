using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Commons.ViewModels;
using CoreIn.EntityCore;
using CoreIn.Media.MediaHelper;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Localization;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.App
{
    public class EntityController<TEntity, TEntityDetail, TLocalizer, TFormDetailViewModel>
        where TEntity: BaseEntity
        where TEntityDetail: BaseEntityDetail
        where TFormDetailViewModel: class, new()
    {
        private readonly CoreInDbContext _dbContext;
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
            _dbContext = dbContext;
            EntityHelper = fieldEntityHelper;
            EntityHelper.SetContext(dbContext);
            _mediaHelper = mediaHelper;
            _localizer = localizer;
            _localizationOptions = localizationOptions;
        }

        public string GetLocalizationString(string sourceString)
            => _localizer[sourceString];

        public DynamicForm<FormValues<TFormDetailViewModel>> GetForm(long? entityId, string requestLanguage = null)
        {
            var formInputLanguage = requestLanguage ?? _localizationOptions.Value.DefaultRequestCulture.Culture.Name;

            var form = new DynamicForm<FormValues<TFormDetailViewModel>>
            {
                Title = _localizer["Create a new"],
                Details = FormUtitities.ViewModelTypeToFormField(typeof(TFormDetailViewModel), _localizer),
                InitialValues = new FormValues<TFormDetailViewModel>()
                {
                    Language = formInputLanguage
                }
            };

            if (entityId != null)
            {
                form.Title = _localizer["Update"];
                form.Languages = _localizationOptions.Value.SupportedUICultures.ToDictionary(c => c.Name, c => c.NativeName);
                form.DefaultLanguage = formInputLanguage;

                var entity = EntityHelper.Entity(entityId ?? 0);

                var details = EntityHelper.GetDetails(entity, formInputLanguage).ToList();
                var localizationFieldNames = details.Where(o => o.Language != null).Select(o => o.Field);
                var localizationFilteredDetails = details.AsEnumerable().Where(o => !(localizationFieldNames.Contains(o.Field) && o.Language == null));

                form.InitialValues.Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } };
                (form.InitialValues as FormValues<TFormDetailViewModel>).Details = FormUtitities.EntityDetailsToFieldValues<TEntityDetail, TFormDetailViewModel>(localizationFilteredDetails);
            }

            return form;
        }

        public IQueryable<TEntity> Gets()
         => EntityHelper.Entities();

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
            entity.Name = EntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

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

        public IEnumerable<BaseEntityViewModel> ToViewModels(IEnumerable<TEntity> entities)
        {
            foreach (var project in entities)
            {
                var details = EntityHelper.GetDetails(project);
                yield return new BaseEntityViewModel()
                {
                    Id = project.Id,
                    Title = details.FirstOrDefault(o => o.Field == "title")?.Value,
                    Thumbnail = _mediaHelper.GetThumbnailPath(details.FirstOrDefault(o => o.Field == "thumbnail")?.Value)
                };
            }
        }

        public int Save()
            => _dbContext.SaveChanges();
    }
}
