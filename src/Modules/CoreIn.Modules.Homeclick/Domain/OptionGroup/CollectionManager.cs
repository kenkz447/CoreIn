using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Media.MediaHelper;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.OptionGroup.Form;
using CoreIn.Modules.Homeclick.Models;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick
{
    public class OptionGroupManager
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IEntityHelper<OptionGroup, OptionGroupDetail> _optionGroupEntityHelper;
        private readonly IMediaHelper _mediaHelper;

        public OptionGroupManager(CoreInDbContext dbContext, IMediaHelper mediaHelper, IEntityHelper<OptionGroup, OptionGroupDetail> projectEntityHelper)
        {
            _dbContext = dbContext;

            _mediaHelper = mediaHelper;

            _optionGroupEntityHelper = projectEntityHelper;
            _optionGroupEntityHelper.SetContext(_dbContext);
        }

        public IQueryable<OptionGroup> Gets()
        {
            return _optionGroupEntityHelper.Entities();
        }
             
        public DynamicForm GetForm(long? entityTypeId, long? entityId)
        {
            var form = new DynamicForm
            {
                Meta = new List<FormField>
                {
                    new FormField
                    {
                        Name = "entityTypeId",
                        Status = FieldStatus.Hidden,
                    }
                },
                Details = FormUtitities.ViewModelToFormField(typeof(OptionGroupDetailViewModel)),
            };

            if (entityId != null)
            {

                var entity = _optionGroupEntityHelper.Entity(entityId ?? 0);
                var details = _optionGroupEntityHelper.Details(entity).ToList();

                var formValues = new OptionGroupFormValues()
                {
                    Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } },
                    Details = FormUtitities.EntityDetailsToFieldValues<OptionGroupDetail, OptionGroupDetailViewModel>(details)
                };

                form.InitialValues = formValues;
            }

            return form;
        }

        public OptionGroup Create(OptionGroup newEntity, OptionGroupDetail[] details, User user = null)
        {
            newEntity.Name = _optionGroupEntityHelper.GenerateEntityName(newEntity.Name);

            var entity = _optionGroupEntityHelper.Add(newEntity, user);
            if (details != null)
                entity.Details = details;

            Save();

            return entity;
        }

        public int Update(long projectId, OptionGroupDetail[] details, User user = null)
        {
            var entity = _optionGroupEntityHelper.Entity(projectId);
            entity.Name = _optionGroupEntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            _optionGroupEntityHelper.UpdateDetails(entity, details, user);
           
            return Save();
        }

        public int Deletes(long[] ids)
        {
            foreach (var id in ids)
            {
                var entity = _optionGroupEntityHelper.Entity(id);
                _optionGroupEntityHelper.Delete(entity);
            }

            return Save();
        }

        public IEnumerable<OptionGroupViewModel> ToViewModels(IEnumerable<OptionGroup> projects)
        {
            foreach (var project in projects)
            {
                var details = _optionGroupEntityHelper.Details(project);
                yield return new OptionGroupViewModel()
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
