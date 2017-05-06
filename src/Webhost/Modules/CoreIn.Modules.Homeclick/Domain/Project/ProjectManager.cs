using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Media.MediaHelper;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Project.Form;
using CoreIn.Modules.Homeclick.Models;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick
{
    public class ProjectManager
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IEntityHelper<Project, ProjectDetail> _projectEntityHelper;
        private readonly IMediaHelper _mediaHelper; 
        public ProjectManager(CoreInDbContext dbContext, IMediaHelper mediaHelper, IEntityHelper<Project, ProjectDetail> projectEntityHelper)
        {
            _dbContext = dbContext;

            _mediaHelper = mediaHelper;

            _projectEntityHelper = projectEntityHelper;
            _projectEntityHelper.SetContext(_dbContext);
        }

        public IQueryable<Project> GetProjects()
        {
            return _projectEntityHelper.Entities();
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
                Details = FormUtitities.ViewModelToFormField(typeof(ProjectDetailsViewModel)),
            };

            if (entityId != null)
            {

                var entity = _projectEntityHelper.Entity(entityId ?? 0);
                var details = _projectEntityHelper.Details(entity).ToList();

                var formValues = new ProjectFormValues()
                {
                    Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } },
                    Details = FormUtitities.EntityDetailsToFieldValues<ProjectDetail, ProjectDetailsViewModel>(details)
                };

                form.InitialValues = formValues;
            }

            return form;
        }

        public Project CreateProject(Project newEntity, ProjectDetail[] details, User user = null)
        {
            newEntity.Name = _projectEntityHelper.GenerateEntityName(newEntity.Name);

            var entity = _projectEntityHelper.Add(newEntity, user);
            if (details != null)
                entity.Details = details;

            Save();

            return entity;
        }

        public int UpdateProject(long projectId, ProjectDetail[] details, User user = null)
        {
            var entity = _projectEntityHelper.Entity(projectId);
            entity.Name = _projectEntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            _projectEntityHelper.UpdateDetails(entity, details, user);
           
            return Save();
        }

        public int DeleteProjects(long[] ids)
        {
            foreach (var id in ids)
            {
                var entity = _projectEntityHelper.Entity(id);
                _projectEntityHelper.Delete(entity);
            }

            return Save();
        }

        public IEnumerable<ProjectViewModel> ToViewModels(IEnumerable<Project> projects)
        {
            foreach (var project in projects)
            {
                var details = _projectEntityHelper.Details(project);
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
