using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using CoreIn.Resources.ConstantKeys;
using CoreIn.Models.Infrastructure;
using Microsoft.Extensions.DependencyInjection;

namespace CoreIn.EntityCore
{
    public class TaxonomyHelper : ITaxonomyHelper
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IEntityTypeManager _entityTypeManager;
        private readonly IEntityHelper<TaxonomyType, TaxonomyTypeDetail> _taxTypeEntityHelper;
        private readonly IEntityHelper<Taxonomy, TaxonomyDetail> _taxEntityHelper;
        private readonly IServiceProvider _serviceProvider;

        public TaxonomyHelper(IServiceProvider serviceProvider, CoreInDbContext dbContext, IEntityTypeManager entityTypeManager, IEntityHelper<TaxonomyType, TaxonomyTypeDetail> taxTypeEntityHelper, IEntityHelper<Taxonomy, TaxonomyDetail> entityHelper)
        {
            _serviceProvider = serviceProvider;

            _dbContext = dbContext;

            _entityTypeManager = entityTypeManager;
            _entityTypeManager.SetContext(dbContext);

            _taxTypeEntityHelper = taxTypeEntityHelper;
            _taxTypeEntityHelper.SetContext(dbContext);

            _taxEntityHelper = entityHelper;
            _taxEntityHelper.SetContext(dbContext);
        }

        public TaxonomyType GetTaxonomyTypeOf(long taxonomyId)
        {
            var entity = _taxEntityHelper.Entity(taxonomyId);
            return  _taxTypeEntityHelper.Entity(entity.TaxonomyTypeId);
        }

        public DynamicForm GetForm(long taxonomyTypeId)
        {
            var newForm = new DynamicForm()
            {
                Meta = new List<FormField>
                {
                    new FormField
                    {
                        Status = FieldStatus.Hidden,
                        Input = new FieldInput(AppKey.TaxonomyTypeId),
                    }
                },
                Details = new List<FormField>
                {
                    new FormField
                    {
                        Display = new FieldDisplay
                        {
                            Title = "Title",
                            RenderType = FieldRenderType.FormGroup
                        },
                        Validate = new FieldValidate
                        {
                            Required = new Dictionary<string, object>
                            {
                                { "value", true },
                                { "error", "Title is required!" }
                            }
                        },
                        Input = new FieldInput("title"),
                    }
                },
                InitialValues = new FormValues
                {
                    Meta = new Dictionary<string, string>
                    {
                        { "taxonomyTypeId",  taxonomyTypeId.ToString() }
                    }
                }
            };

            return newForm;
        }

        public DynamicForm GetFormFor(long taxonomyId)
        {
            var entity = _taxEntityHelper.Entity(taxonomyId);

            var form = GetForm(entity.TaxonomyTypeId);

            form.Meta.Add(new FormField
            {
                Status = FieldStatus.Hidden,
                Input = new FieldInput("id"),
            });

            form.Meta.Add(new FormField
            {
                Status = FieldStatus.Hidden,
                Input = new FieldInput(AppKey.ParentId),
            });

            var formValues = new FormValues();
            formValues.Meta = new Dictionary<string, string>()
            {
                {"id", entity.Id.ToString() },
                {AppKey.ParentId, entity.ParentId.ToString() },
                {AppKey.TaxonomyTypeId, entity.TaxonomyTypeId.ToString() },
            };

            var entityDetails = _taxEntityHelper.Details(entity);

            formValues.Details = new Dictionary<string, string>();
            foreach (var item in entityDetails)
            {
                formValues.Details.Add(item.Field, item.Value);
            }

            form.InitialValues = formValues;

            return form;
        }

        public TaxonomyType RegisterTaxonomyType(EntityType entityType, string name, Dictionary<string, string> detailDictionary, User byUser)
        {
            var taxType = _taxTypeEntityHelper.Entity(name);
            if (taxType == null)
            {

                taxType = new TaxonomyType
                {
                    Name = _taxTypeEntityHelper.GenerateEntityName(name),
                    EntityType = entityType
                };
                _taxTypeEntityHelper.Add(taxType);
                _taxTypeEntityHelper.CreateDetails(taxType, detailDictionary, byUser);
            }
            else
                _taxTypeEntityHelper.UpdateDetails(taxType, detailDictionary, byUser);

            Save();

            return taxType;
        }

        public TaxonomyType RegisterTaxonomyType(string entityTypeName, string name, Dictionary<string, string> detailDictionary, User byUser)
        {
            var entityType = _entityTypeManager.GetEntityType(entityTypeName);
            return RegisterTaxonomyType(entityType, name, detailDictionary, byUser);
        }

        public Taxonomy CreateTaxonomy(long taxonomyTypeId, long? parentId, string name, Dictionary<string, string> detailDictionary, User byUser)
        {
            if (name == null || name == string.Empty)
                name = detailDictionary["title"];

            var taxonomy = new Taxonomy
            {
                Name = _taxEntityHelper.GenerateEntityName(name),
                ParentId = parentId,
                TaxonomyTypeId = taxonomyTypeId,
                OwnerId = byUser.Id,
                Created = DateTime.UtcNow
            };

            _taxEntityHelper.Add(taxonomy);
            _taxEntityHelper.CreateDetails(taxonomy, detailDictionary, byUser);

            Save();
            return taxonomy;
        }

        public TaxonomyViewModel TaxonomyToViewModel(Taxonomy taxonomy)
        {
            var details = _taxEntityHelper.Details(taxonomy).ToList();

            var result = new TaxonomyViewModel
            {
                Id = taxonomy.Id,
                Name = taxonomy.Name,
                ParentId = taxonomy.ParentId,
                Title = details.First(o => o.Field == "title").Value
            };

            return result;
        }

        public IEnumerable<TaxonomyViewModel> TaxonomiesToViewModels(IEnumerable<Taxonomy> taxonomies)
        {
            var result = new List<TaxonomyViewModel>();
            foreach (var taxonomy in taxonomies)
            {
                result.Add(TaxonomyToViewModel(taxonomy));
            }
            return result;
        }

        public IEnumerable<TaxonomyTypeViewModel> GetTaxonomiesTypeViewModels(long? entityTypeId = null, bool includeTaxonomies = false)
        {
            var taxonomytypes = new List<TaxonomyType>();
            if (entityTypeId != null)
                taxonomytypes.AddRange(GetTaxonomyTypesForEntityType(entityTypeId ?? 0));
            else
                taxonomytypes = _taxTypeEntityHelper.Entities().ToList();

            foreach (var taxonomyType in taxonomytypes)
            {
                var details = _taxTypeEntityHelper.Details(taxonomyType);
                var entityType = _entityTypeManager.GetEntityType(taxonomyType.EntityTypeId ?? 0);
                var entityTypeDetails = _entityTypeManager.GetEntityTypeDetails(entityType);

                var result = new TaxonomyTypeViewModel
                {
                    Id = taxonomyType.Id,
                    Name = taxonomyType.Name,
                    Title = details.FirstOrDefault(o => o.Field == "title")?.Value,
                    EntityTypeGroup = entityTypeDetails.FirstOrDefault(o => o.Field == "group")?.Value,
                    EntityType = entityTypeDetails.FirstOrDefault(o => o.Field == "title")?.Value
                };
                if (includeTaxonomies)
                {
                    var taxonomies = GetTaxonomies(result.Id, true);

                    result.Taxonomies = taxonomies.Select(o => new TaxonomyViewModel
                    {
                        Id = o.Id,
                        Name = o.Name,
                        ParentId = o.ParentId,
                        Title = o.Details.FirstOrDefault(d => d.Field == "title").Value
                    });
                }

                yield return result;
            }
        }

        public IEnumerable<Taxonomy> GetTaxonomies(long TaxonomyTypeId, bool includeDetails = false)
        {
            var taxonomies = _taxEntityHelper.Entities().Where(o => o.TaxonomyTypeId == TaxonomyTypeId).ToList();
            if (includeDetails)
                foreach (var taxonomy in taxonomies)
                {
                    taxonomy.Details = _taxEntityHelper.Details(taxonomy).ToList();
                }

            return taxonomies;
        }

        public int DeleteTaxonomy(long taxonomyId)
        {
            var taxonomy = _taxEntityHelper.Entity(taxonomyId);
            _taxEntityHelper.Delete(taxonomy);
            return Save();
        }

        public Taxonomy UpdateTaxonomy(long? parentId, long id, Dictionary<string, string> detailDictionary, User byUser)
        {
            var taxonomy = _taxEntityHelper.Entity(id);
            taxonomy.ParentId = parentId;
            _taxEntityHelper.Update(taxonomy);
            _taxEntityHelper.UpdateDetails(taxonomy, detailDictionary, byUser);

            _dbContext.SaveChanges();

            return taxonomy;
        }

        public int UpdateTaxonomyTree(Dictionary<long, long?> idParerntId)
        {
            foreach (var kv in idParerntId)
            {
                var taxonomy = _taxEntityHelper.Entity(kv.Key);
                taxonomy.ParentId = kv.Value;
                _taxEntityHelper.Update(taxonomy);
            }
            return Save();
        }

        private int Save()
            => _dbContext.SaveChanges();

        public TaxonomyType GetTaxonomyType(long taxonomyTypeId)
        {
            var type = _taxTypeEntityHelper.Entity(taxonomyTypeId);
            type.Details = _taxTypeEntityHelper.Details(type).ToList();
            return type;
        }

        public void UpdateTaxonomiesForEntity<TEntityTaxonomy>(long EntityId, long entityTypeId, Dictionary<long,long[]> taxonomyTypeIdTaxonomyIds) where TEntityTaxonomy : BaseEntityTaxonomy, new()
        {
            var relationHelper = _serviceProvider.GetService<IEntityTaxonomyRelationHelper<TEntityTaxonomy>>();
           
            var taxonomyTypes = GetTaxonomiesTypeViewModels(entityTypeId, true);

            foreach (var taxonomyType in taxonomyTypes)
            {
                var taxonomyIdsOfTaxonomyType = taxonomyType.Taxonomies.Select(o => o.Id);
                var taxonomiesRelateToEntity = relationHelper.GetTaxonomiesForEntity(EntityId, taxonomyType.Id);

                var updateTaxonomyIds = taxonomyTypeIdTaxonomyIds[taxonomyType.Id];
                var entityTaxonomyIds = taxonomiesRelateToEntity.Select(o => o.TaxonomyId);

                var taxonomyIdsWillRemoveFormEntity = entityTaxonomyIds.Except(updateTaxonomyIds);
                relationHelper.RemoveTaxonomyFromEntity(taxonomiesRelateToEntity.Where(o => taxonomyIdsWillRemoveFormEntity.Contains(o.TaxonomyId)).Select(o => o.Id));

                var taxonomyIdsWillAddToEntity = updateTaxonomyIds.Except(entityTaxonomyIds).ToArray();
                relationHelper.AddTaxonomiesToEntity(EntityId, taxonomyIdsWillAddToEntity);
            }
        }

        public IEnumerable<TaxonomyType> GetTaxonomyTypesForEntityType(long entityTypeId)
        {
            var taxonomytypes = new List<TaxonomyType>();

            var entityType = _entityTypeManager.GetEntityType(entityTypeId);
            if (entityType.ParentId != null)
            {
                var entityTypeParent = _entityTypeManager.GetEntityType(entityType.ParentId ?? 0);
                taxonomytypes.AddRange(_taxTypeEntityHelper.Entities().Where(o => o.EntityTypeId == entityType.ParentId).ToList());
            }
            taxonomytypes.AddRange(_taxTypeEntityHelper.Entities().Where(o => o.EntityTypeId == entityTypeId).ToList());

            return taxonomytypes;
        }
    }
}
