using CoreIn.Commons.Form.Attributes;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace CoreIn.Commons.Form
{
    public static class FormUtitities
    {
        public static List<FormField> ViewModelToFormField(Type type)
        {
            var formFields = new List<FormField>();

            var props = type.GetProperties();
            foreach (var prop in props)
            {
                var field = new FormField();

                field.Name = prop.Name.ToLower();

                var displayAttr = prop.GetCustomAttribute<FormFieldDisplayAttribute>();
                if (displayAttr != null)
                    field.Display = displayAttr.FieldDisplay;

                var actionAttr = prop.GetCustomAttribute<FormFieldActionAttribute>();
                if (actionAttr != null)
                    field.Actions = new List<FieldAction> { actionAttr.FieldAction };

                var propType = prop.PropertyType;
                var isGenericType = propType.GetTypeInfo().IsGenericType;

                if (isGenericType && 
                    (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                    propType.GetGenericTypeDefinition() == typeof(List<>))
                    )
                {
                    var argumentType = propType.GetGenericArguments()[0];

                    field.ChildFields = ViewModelToFormField(argumentType);
                }

                var requiredAtrr = prop.GetCustomAttribute<RequiredAttribute>();
                if (requiredAtrr != null)
                {
                    field.FieldValidate = new FieldValidate();
                    field.FieldValidate.Required = requiredAtrr.ErrorMessage;
                }

                formFields.Add(field);
            }
            return formFields;
        }

        private static IEnumerable<TEntityDetail> ListToDetails<TEntityDetail>(IEnumerable<object> list, string group = null, User user = null)
                        where TEntityDetail : BaseEntityDetail, new()
        {
            var entityDetails = new List<TEntityDetail>();

            var listType = list.GetType();
            var argumentType = listType.GetGenericArguments()[0];
            var argumentProps = argumentType.GetProperties();
            int i = 0;
            foreach (var value in list)
            {
                foreach (var prop in argumentProps)
                {
                    var propType = prop.PropertyType;
                    var isGenericType = propType.GetTypeInfo().IsGenericType;

                    var propValueDic = value.ToDictionary<object>();
                    var propValue = propValueDic.ContainsKey(prop.Name) ? propValueDic[prop.Name] : null;

                    if (isGenericType &&
                        (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                        propType.GetGenericTypeDefinition() == typeof(List<>))
                        )
                    {
                        entityDetails.AddRange(ListToDetails<TEntityDetail>(propValue as IEnumerable<object>, prop.Name.ToLower(), user));
                    }
                    else
                    {
                        var entityDetail = new TEntityDetail()
                        {
                            Field = prop.Name.ToLower(),
                            Group = group,
                            Prefix = i.ToString(),
                            ModifiedById = user?.Id,
                            Modified = DateTime.UtcNow,
                            Value = propValue?.ToString()
                        };
                        entityDetails.Add(entityDetail);
                    }
                }
                i++;
            }

            return entityDetails;
        }

        public static IEnumerable<TEntityDetail> ViewModelToEntityDetails<TEntityDetail, TDetail>(TDetail details, string group = null, User user = null)
            where TEntityDetail : BaseEntityDetail, new()
        {
            var entityDetails = new List<TEntityDetail>();

            var props = typeof(TDetail).GetProperties();
            foreach (var prop in props)
            {
                var propName = prop.Name.ToLower();
                var propType = prop.PropertyType;
                var isGenericType = propType.GetTypeInfo().IsGenericType;

                if (isGenericType &&
                    (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                    propType.GetGenericTypeDefinition() == typeof(List<>))
                    )
                {
                    var values = prop.GetValue(details) as IEnumerable<object>;

                    entityDetails.AddRange(ListToDetails<TEntityDetail>(values, propName, user));
                }
                else
                {
                    var entityDetail = new TEntityDetail()
                    {
                        Field = propName,
                        Group = group,
                        ModifiedById = user?.Id,
                        Modified = DateTime.UtcNow,
                        Value = prop.GetValue(details).ToString()
                    };
                    entityDetails.Add(entityDetail);
                }
            }

            return entityDetails;
        }
    }
}
