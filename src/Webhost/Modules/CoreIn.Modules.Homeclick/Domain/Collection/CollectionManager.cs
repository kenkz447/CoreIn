using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Media.MediaHelper;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Project.Form;
using CoreIn.Modules.Homeclick.Models;
using CoreIn.Modules.Homeclick.Models.ViewModel.Collection;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick
{
    public class CollectionManager
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IEntityHelper<Collection, CollectionDetail> _collectionEntityHelper;
        private readonly IMediaHelper _mediaHelper;

        public CollectionManager(CoreInDbContext dbContext, IMediaHelper mediaHelper, IEntityHelper<Collection, CollectionDetail> projectEntityHelper)
        {
            _dbContext = dbContext;

            _mediaHelper = mediaHelper;

            _collectionEntityHelper = projectEntityHelper;
            _collectionEntityHelper.SetContext(_dbContext);
        }

        public IQueryable<Collection> GetCollections()
        {
            return _collectionEntityHelper.Entities();
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
                Details = FormUtitities.ViewModelToFormField(typeof(CollectionDetailViewModel)),
            };

            if (entityId != null)
            {

                var entity = _collectionEntityHelper.Entity(entityId ?? 0);
                var details = _collectionEntityHelper.Details(entity).ToList();

                var formValues = new CollectionFormValues()
                {
                    Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } },
                    Details = FormUtitities.EntityDetailsToFieldValues<CollectionDetail, CollectionDetailViewModel>(details)
                };

                form.InitialValues = formValues;
            }

            return form;
        }

        public Collection CreateProject(Collection newEntity, CollectionDetail[] details, User user = null)
        {
            newEntity.Name = _collectionEntityHelper.GenerateEntityName(newEntity.Name);

            var entity = _collectionEntityHelper.Add(newEntity, user);
            if (details != null)
                entity.Details = details;

            Save();

            return entity;
        }

        public int UpdateProject(long projectId, CollectionDetail[] details, User user = null)
        {
            var entity = _collectionEntityHelper.Entity(projectId);
            entity.Name = _collectionEntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            _collectionEntityHelper.UpdateDetails(entity, details, user);
           
            return Save();
        }

        public int DeleteProjects(long[] ids)
        {
            foreach (var id in ids)
            {
                var entity = _collectionEntityHelper.Entity(id);
                _collectionEntityHelper.Delete(entity);
            }

            return Save();
        }

        public IEnumerable<ProjectViewModel> ToViewModels(IEnumerable<Collection> projects)
        {
            foreach (var project in projects)
            {
                var details = _collectionEntityHelper.Details(project);
                yield return new ProjectViewModel()
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
