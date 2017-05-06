using CoreIn.Commons.Form.Attributes;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
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

                var statusAttr = prop.GetCustomAttribute<FormFieldStatusAttribute>();
                if (statusAttr != null)
                    field.Status = statusAttr.FieldStatus;
                
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
                    if (propValue != null)
                    {
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
                                Value = propValue.ToString()
                            };
                            entityDetails.Add(entityDetail);
                        }
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
                var value = prop.GetValue(details);

                if (value != null)
                {
                    if (isGenericType &&
                    (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                    propType.GetGenericTypeDefinition() == typeof(List<>))
                    )
                    {
                        var values = value as IEnumerable<object>;

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
                            Value = value.ToString()
                        };
                        entityDetails.Add(entityDetail);
                    }
                }
            }

            return entityDetails;
        }

        private static object EntityDetailsToFieldValues<TEntityDetail>(Type argumentType, IEnumerable<TEntityDetail> entityDetails, string group)
            where TEntityDetail : BaseEntityDetail
        {
            var list = (System.Collections.IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(argumentType));

            var detailGroup = entityDetails.Where(o => o.Group == group).ToList();
            var props = argumentType.GetProperties();

            var i = 0;
            while (detailGroup.Count() > 0)
            {
                var detail = Activator.CreateInstance(argumentType);
                var detailsOfIndex = detailGroup.Where(o => o.Prefix == i.ToString());

                foreach (var prop in props)
                {
                    var propName = prop.Name.ToLower();
                    var propType = prop.PropertyType;
                    var isGenericType = propType.GetTypeInfo().IsGenericType;

                    if (isGenericType &&
                        (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) || propType.GetGenericTypeDefinition() == typeof(List<>)))
                        prop.SetValue(detail, EntityDetailsToFieldValues(propType.GetGenericArguments()[0], entityDetails, propName));
                    else
                        prop.SetValue(detail, detailsOfIndex.FirstOrDefault(o => o.Field == propName)?.Value);
                }

                list.Add(detail);
                detailGroup = detailGroup.Except(detailsOfIndex).ToList();
                i++;
            }

            return list;
        }

        public static TDetail EntityDetailsToFieldValues<TEntityDetail, TDetail>(IEnumerable<TEntityDetail> entityDetails)
            where TDetail: class, new()
            where TEntityDetail: BaseEntityDetail
        {
            var detail = new TDetail();

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
                    var argumentType = propType.GetGenericArguments()[0];
                    prop.SetValue(detail, EntityDetailsToFieldValues(argumentType, entityDetails, propName));
                }
                else
                {
                    prop.SetValue(detail, entityDetails.FirstOrDefault(o => o.Field == propName)?.Value);
                }
            }

            return detail;
        }
    }
}
