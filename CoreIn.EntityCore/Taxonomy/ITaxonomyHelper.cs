using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using System.Collections.Generic;

namespace CoreIn.EntityCore
{
    public interface ITaxonomyHelper
    {
        DynamicForm GetForm(long taxonomyTypeId);
        DynamicForm GetFormFor(string taxonomyName);
        TaxonomyType RegisterTaxonomyType(EntityType entityType, string name, Dictionary<string, string> detailDictionary, User byUser);
        TaxonomyType RegisterTaxonomyType(string entityTypeName, string name, Dictionary<string, string> detailDictionary, User byUser);
        IEnumerable<TaxonomyTypeViewModel> GetTaxonomiesTypeViewModels();
        TaxonomyViewModel TaxonomyToViewModel(Taxonomy taxonomy);
        IEnumerable<TaxonomyViewModel> TaxonomiesToViewModels(IEnumerable<Taxonomy> taxonomies);
        Taxonomy CreateTaxonomy(long taxonomyTypeId, long? parentId, string name, Dictionary<string, string> detailDictionary, User byUser);
        IEnumerable<Taxonomy> GetTaxonomies(long TaxonomyTypeId);
        int DeleteTaxonomy(long taxonomyId);
        Taxonomy UpdateTaxonomy(long? parentId, long id, Dictionary<string, string> detailDictionary, User byUser);
        TaxonomyType GetTaxonomyTypeOf(long taxonomyId);
    }
}
