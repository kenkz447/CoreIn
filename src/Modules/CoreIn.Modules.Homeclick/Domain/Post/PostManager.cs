using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.EntityCore;
using CoreIn.Media.MediaHelper;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Modules.Homeclick.Domain.Post.Form;
using CoreIn.Modules.Homeclick.Models;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modules.Homeclick
{
    public class PostManager
    {
        private readonly CoreInDbContext _dbContext;
        private readonly EntityTypeManager _entityTypeManager;

        private readonly IEntityHelper<Post, PostDetail> _postEntityHelper;
        private readonly ITaxonomyHelper _taxonomyHelper;

        private readonly IMediaHelper _mediaHelper; 

        public PostManager(CoreInDbContext dbContext, 
            EntityTypeManager entityTypeManager, 
            IMediaHelper mediaHelper, 
            ITaxonomyHelper taxonomyHelper,
            IEntityHelper<Post, PostDetail> postEntityHelper)
        {
            _dbContext = dbContext;

            _entityTypeManager = entityTypeManager;

            _taxonomyHelper = taxonomyHelper;

            _mediaHelper = mediaHelper;

            _postEntityHelper = postEntityHelper;
            _postEntityHelper.SetContext(_dbContext);
        }

        public IQueryable<Post> GetPosts()
        {
            return _postEntityHelper.Entities();
        }
             
        public DynamicForm GetForm(long? entityId, long? entityTypeId = null)
        {
            var taxonomyTypesViewModels = _taxonomyHelper.GetTaxonomiesTypeViewModels(_entityTypeManager.Post.Id, true);

            var form = new DynamicForm
            {
                Meta = new List<FormField>
                {
                    new FormField
                    {
                        Name = "entityTypeId",
                        Status = FieldStatus.Hidden,
                    },
                    new FormField
                    {
                        Name = "entityTypeId",
                        Display = new FieldDisplay
                        {
                            Type = "select",
                            Title = "Entity type"
                        },
                        Values = new Dictionary<string, string>()
                        {
                            {"a", "b" },
                            {"c", "d" }
                        }
                    }
                },
                Details = FormUtitities.ViewModelToFormField(typeof(PostDetailsViewModel)),
                TaxonomyTypes = taxonomyTypesViewModels.Select(o => new FormTaxonomyType(o))
            };

            if (entityId != null)
            {

                var entity = _postEntityHelper.Entity(entityId ?? 0);
                var details = _postEntityHelper.Details(entity).ToList();

                var formValues = new PostFormValues()
                {
                    Meta = new Dictionary<string, string>() { { "id", entityId.ToString() } },
                    Details = FormUtitities.EntityDetailsToFieldValues<PostDetail, PostDetailsViewModel>(details)
                };

                foreach (var taxonomyTypeViewModel in taxonomyTypesViewModels)
                {
                    var relateTaxonomies = _taxonomyHelper.GetTaxonomiesForEntity<PostTaxonomy>(entity.Id, taxonomyTypeViewModel.Id);
                    formValues.TaxonomyTypes.Add(taxonomyTypeViewModel.Id, relateTaxonomies.ToDictionary(o => o.TaxonomyId, o => true));
                }

                form.InitialValues = formValues;
            }

            return form;
        }

        public Post CreatePost(Post newEntity, PostDetail[] details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null)
        {
            newEntity.Name = _postEntityHelper.GenerateEntityName(newEntity.Name);

            var entity = _postEntityHelper.Add(newEntity, user);

            if (details != null)
                entity.Details = details;

            if (taxonomyTypeIdTaxonomyIds != null)
                _taxonomyHelper.UpdateTaxonomiesForEntity<PostTaxonomy>(entity.Id, _entityTypeManager.Post.Id, taxonomyTypeIdTaxonomyIds);

            Save();

            return entity;
        }

        public int UpdatePost(long projectId, PostDetail[] details, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds = null, User user = null)
        {
            var entity = _postEntityHelper.Entity(projectId);
            entity.Name = _postEntityHelper.GenerateEntityName(details.FirstOrDefault(o => o.Field == "title")?.Value);

            _postEntityHelper.UpdateDetails(entity, details, user);

            _taxonomyHelper.UpdateTaxonomiesForEntity<PostTaxonomy>(entity.Id, entity.EntityTypeId ?? 0, taxonomyTypeIdTaxonomyIds);

            return Save();
        }

        public int DeletePosts(long[] ids)
        {
            foreach (var id in ids)
            {
                var entity = _postEntityHelper.Entity(id);
                _postEntityHelper.Delete(entity);
            }

            return Save();
        }

        public IEnumerable<PostViewModel> ToViewModels(IEnumerable<Post> entities)
        {
            foreach (var entity in entities)
            {
                var details = _postEntityHelper.Details(entity);
                yield return new PostViewModel()
                {
                    Id = entity.Id,
                    Title = details.FirstOrDefault(o => o.Field == "title")?.Value,
                    Thumbnail = _mediaHelper.GetThumbnailPath(details.FirstOrDefault(o => o.Field == "thumbnail")?.Value)
                };
            }
        }

        public int Save()
            => _dbContext.SaveChanges();
    }
}
