using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.EntityCore
{
    public class EntityFieldManager
    {
        public readonly CoreInDbContext _dbContext;
        public readonly IEntityHelper<EntityField, EntityFieldDetail> _fieldEntityHelper;
        public readonly ITaxonomyHelper _taxonomyManager;

        public EntityFieldManager(CoreInDbContext dbContext, IEntityHelper<EntityField, EntityFieldDetail> fieldEntityHelper)
        {
            _dbContext = dbContext;

            _fieldEntityHelper = fieldEntityHelper;

            _fieldEntityHelper.SetContext(dbContext);
        }

        public void RegisterFieldForTaxonomyType(long taxonomyTypeId, string fieldName, FieldDisplay fieldDisplay, FieldValidate fieldValidate, FieldStatus fieldStatus, User byUser)
        {
            var field = _fieldEntityHelper.CreateEntity(fieldName, byUser);
            var validateDic = fieldValidate.ToDictionary();

            foreach (var kv in validateDic)
            {
                //kv.Value = dictonary with some key: value, and error.
                //for Required, we has two field: 
                // - group: "validate", field: "required", value: "true", suffix: "value"
                // - group: "validate", field: "required", value: "Field cann't be empty", suffix: "error".
                // 'error' is optional, using default when not set.
                foreach (var kv2 in kv.Value)
                {
                    _fieldEntityHelper.CreateDetail(field, kv.Key, kv2.Value, "validate", null, kv2.Key, byUser);
                }
            }
            var displayDic = fieldDisplay.ToDictionary<string>();
            foreach (var kv in displayDic)
            {
                _fieldEntityHelper.CreateDetail(field, kv.Key, kv.Value, "display", null, null, byUser);
            }

            _fieldEntityHelper.CreateDetail(field, "fieldStatus", fieldStatus, null, null, null, byUser);


            _dbContext.SaveChanges();
        }
    }
}
