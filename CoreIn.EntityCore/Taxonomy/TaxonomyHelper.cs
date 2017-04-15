using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.EntityCore
{
    public class TaxonomyHelper : ITaxonomyHelper
    {
        private readonly IEntityTypeManager _entityTypeManager;
        private readonly IEntityHelper<TaxonomyType, TaxonomyTypeDetail> _taxTypeEntityHelper;
        private readonly IEntityHelper<Taxonomy, TaxonomyDetail> _taxEntityHelper;

        public TaxonomyHelper(IEntityTypeManager entityTypeManager, IEntityHelper<TaxonomyType, TaxonomyTypeDetail> taxTypeEntityHelper, IEntityHelper<Taxonomy, TaxonomyDetail> entityHelper)
        {
            _entityTypeManager = entityTypeManager;
            _taxTypeEntityHelper = taxTypeEntityHelper;
            _taxEntityHelper = entityHelper;
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
                        Input = new FieldInput("taxonomyTypeId"),
                    }
                },
                Details = new List<FormField>
                {
                    new FormField
                    {
                        Display = new FieldDisplay
                        {
                            Label = "Title",
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

        public DynamicForm GetFormFor(string taxonomyName)
        {
            var entity = _taxEntityHelper.Entity(taxonomyName);

            var form = GetForm(entity.TaxonomyTypeId);

            var formValue = new FormValues();
            formValue.Meta.Add("taxonomyTypeId", entity.TaxonomyTypeId.ToString());

            var entityDetails = _taxEntityHelper.Details(entity);
            foreach (var item in entityDetails)
            {
                formValue.Details.Add(item.Field, item.Value);
            }

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
            foreach (var taxonomy in taxonomies)
            {
                yield return TaxonomyToViewModel(taxonomy);
            }
        }

        public IEnumerable<TaxonomyTypeViewModel> GetTaxonomiesTypeViewModels()
        {
            var taxonomytypes = _taxTypeEntityHelper.Entities().ToList();
            
            foreach (var taxonomyType in taxonomytypes)
            {
                var details = _taxTypeEntityHelper.Details(taxonomyType);
                var entityType = _entityTypeManager.GetEntityType(taxonomyType.EntityTypeId ?? 0);
                var entityTypeDetails = _entityTypeManager.GetEntityTypeDetails(entityType);

                yield return new TaxonomyTypeViewModel
                {
                    Id = taxonomyType.Id,
                    Name = taxonomyType.Name,
                    Title = details.FirstOrDefault(o => o.Field == "title")?.Value,
                    EntityTypeGroup = entityTypeDetails.FirstOrDefault(o => o.Field == "group")?.Value,
                    EntityType = entityTypeDetails.FirstOrDefault(o => o.Field == "title")?.Value
                };
            }
        }

        public IEnumerable<Taxonomy> GetTaxonomies(long TaxonomyTypeId)
        {
            return _taxEntityHelper.Entities().Where(o => o.TaxonomyTypeId == TaxonomyTypeId).ToList();
        }

        public int DeleteTaxonomy(long taxonomyId)
        {
            var taxonomy = _taxEntityHelper.Entity(taxonomyId);
            return _taxEntityHelper.Delete(taxonomy);
        }

        public Taxonomy UpdateTaxonomy(long? parentId, long id, Dictionary<string, string> detailDictionary, User byUser)
        {
            var taxonomy = _taxEntityHelper.Entity(id);
            taxonomy.ParentId = parentId;
            _taxEntityHelper.Update(taxonomy);
            _taxEntityHelper.UpdateDetails(taxonomy, detailDictionary, byUser);

            return taxonomy;
        }
    }
}
