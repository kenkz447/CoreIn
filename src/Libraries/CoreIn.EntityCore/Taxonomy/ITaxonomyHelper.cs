using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using System.Collections.Generic;

namespace CoreIn.EntityCore
{
    public interface ITaxonomyHelper
    {
        DynamicForm GetForm(long taxonomyTypeId);
        DynamicForm GetFormFor(long taxonomyId);
        TaxonomyType RegisterTaxonomyType(EntityType entityType, string name, Dictionary<string, string> detailDictionary, User byUser);
        TaxonomyType RegisterTaxonomyType(string entityTypeName, string name, Dictionary<string, string> detailDictionary, User byUser);
        IEnumerable<TaxonomyTypeViewModel> GetTaxonomiesTypeViewModels(long? entityTypeId = null, bool includeTaxonomies = false);
        TaxonomyViewModel TaxonomyToViewModel(Taxonomy taxonomy);
        IEnumerable<TaxonomyViewModel> TaxonomiesToViewModels(IEnumerable<Taxonomy> taxonomies);
        Taxonomy CreateTaxonomy(long taxonomyTypeId, long? parentId, string name, Dictionary<string, string> detailDictionary, User byUser);
        IEnumerable<Taxonomy> GetTaxonomies(long TaxonomyTypeId, bool includeDetails = false);
        int DeleteTaxonomy(long taxonomyId);
        Taxonomy UpdateTaxonomy(long? parentId, long id, Dictionary<string, string> detailDictionary, User byUser);
        TaxonomyType GetTaxonomyTypeOf(long taxonomyId);
        int UpdateTaxonomyTree(Dictionary<long, long?> idParerntId);
        TaxonomyType GetTaxonomyType(long taxonomyTypeId);
        IEnumerable<TaxonomyType> GetTaxonomyTypesForEntityType(long entityTypeId);
        void UpdateTaxonomiesForEntity<TEntityTaxonomy>(long EntityId, long entityTypeId, Dictionary<long, long[]> taxonomyTypeIdTaxonomyIds) where TEntityTaxonomy : BaseEntityTaxonomy, new();
        IEnumerable<TEntityTaxonomy> GetTaxonomiesForEntity<TEntityTaxonomy>(long entityId, long taxonomyTypeId) where TEntityTaxonomy : BaseEntityTaxonomy, new();
    }
}
