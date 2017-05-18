using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.EntityCore;
using CoreIn.Media.MediaHelper;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Page.Form;
using CoreIn.Modules.Homeclick.Models;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick
{
    public class PageManager
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IEntityHelper<Page, PageDetail> _constructionEntityHelper;
        private readonly IMediaHelper _mediaHelper;
        private readonly ITaxonomyHelper _taxonomyHelper;
        private readonly EntityTypeManager _entityTypeManager;

        public PageManager(CoreInDbContext dbContext, 
            IMediaHelper mediaHelper, 
            IEntityHelper<Page, PageDetail> constructionEntityHelper,
            ITaxonomyHelper taxonomyHelper,
            EntityTypeManager entityTypeManager)
        {
            _dbContext = dbContext;

            _mediaHelper = mediaHelper;

            _taxonomyHelper = taxonomyHelper;
            _entityTypeManager = entityTypeManager;

            _constructionEntityHelper = constructionEntityHelper;
            _constructionEntityHelper.SetContext(_dbContext);
        }

        public IQueryable<Page> Gets()
        {
            return _constructionEntityHelper.Entities();
        }
             
        public DynamicForm GetForm(long? entityId)
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
                Details = FormUtitities.ViewModelToFormField(typeof(PageDetailViewModel)),
            };

            if (entityId != null)
            {

                var entity = _constructionEntityHelper.Entity(entityId ?? 0);
                var details = _constructionEntityHelper.Details(entity).ToList();

                var formValues = new PageFormValues()
                {
                    Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } },
                    Details = FormUtitities.EntityDetailsToFieldValues<PageDetail, PageDetailViewModel>(details)
                };

                form.InitialValues = formValues;
            }

            return form;
        }

        public Page Create(Page newEntity, PageDetail[] details, User user = null)
        {
            newEntity.Name = _constructionEntityHelper.GenerateEntityName(newEntity.Name);

            var entity = _constructionEntityHelper.Add(newEntity, user);
            if (details != null)
                entity.Details = details;

            Save();

            return entity;
        }

        public int Update(long projectId, PageDetail[] details, User user = null)
        {
            var entity = _constructionEntityHelper.Entity(projectId);
            entity.Name = _constructionEntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            _constructionEntityHelper.UpdateDetails(entity, details, user);

            return Save();
        }

        public int Deletes(long[] ids)
        {
            foreach (var id in ids)
            {
                var entity = _constructionEntityHelper.Entity(id);
                _constructionEntityHelper.Delete(entity);
            }

            return Save();
        }

        public IEnumerable<PageViewModel> ToViewModels(IEnumerable<Page> projects)
        {
            foreach (var project in projects)
            {
                var details = _constructionEntityHelper.Details(project);
                yield return new PageViewModel()
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