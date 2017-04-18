using CoreIn.Commons.Form;
using CoreIn.Models.Authentication;

namespace CoreIn.EntityCore
{
    public interface IEntityFieldManager
    {
        void RegisterFieldForTaxonomyType(long taxonomyTypeId, string fieldName, FieldDisplay fieldDisplay, FieldValidate fieldValidate, FieldStatus fieldStatus, User byUser);
    }
}
