using CoreIn.Commons.Form.Attributes;
using CoreIn.Models.Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Localization;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Reflection;

namespace CoreIn.Commons.Form
{
    public static class FormUtitities
    {
        private static bool IsClassAndNotString(Type propType)
        {
            var typeInfo = propType.GetTypeInfo();
            return propType != typeof(string) && !typeInfo.IsPrimitive && !typeInfo.IsGenericType && typeInfo.IsClass;
        }

        private static FieldDisplay ConvertToLocalize<TLoc>(this FieldDisplay fieldDisplay, IStringLocalizer<TLoc> loc)
        {
            var newFieldDisplay = new FieldDisplay();
            var props = fieldDisplay.GetType().GetProperties();
            foreach (var prop in props)
            {
                var sourceValue = prop.GetValue(fieldDisplay);
                if (sourceValue is string)
                {
                    var convertedValue = loc[sourceValue.ToString()].Value;
                    prop.SetValue(newFieldDisplay, convertedValue);
                }
                else
                    prop.SetValue(newFieldDisplay, sourceValue);
            }

            return newFieldDisplay;
        }

        public static List<FormField> ViewModelTypeToFormField<TLoc>(Type type, IStringLocalizer<TLoc> loc)
        {
            var formFields = new List<FormField>();

            var props = type.GetProperties();
            foreach (var prop in props)
            {
                var field = new FormField();

                field.Name = prop.Name.FirstCharacterToLower();

                var displayAttr = prop.GetCustomAttribute<FormFieldDisplayAttribute>();
                if (displayAttr != null)
                    field.Display = displayAttr.FieldDisplay.ConvertToLocalize(loc);

                var actionAttr = prop.GetCustomAttribute<FormFieldActionAttribute>();
                if (actionAttr != null)
                    field.Actions = new List<FieldAction> { actionAttr.FieldAction };

                var statusAttr = prop.GetCustomAttribute<FormFieldStatusAttribute>();
                if (statusAttr != null)
                    field.Status = statusAttr.FieldStatus;
                
                var propType = prop.PropertyType;
                var typeInfo = propType.GetTypeInfo();
                var isGenericType = propType.GetTypeInfo().IsGenericType;

                if (IsClassAndNotString(propType)) {
                    field.ChildFields = ViewModelTypeToFormField(propType, loc);
                }
                else if (isGenericType && 
                    (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                    propType.GetGenericTypeDefinition() == typeof(List<>))
                    )
                {
                    var argumentType = propType.GetGenericArguments()[0];

                    field.ChildFields = ViewModelTypeToFormField(argumentType, loc);
                }

                if (field.ChildFields != null)
                    foreach (var childField in field.ChildFields)
                        childField.IsChildField = true;

                var requiredAtrr = prop.GetCustomAttribute<RequiredAttribute>();
                if (requiredAtrr != null)
                {
                    field.FieldValidate = new FieldValidate();
                    field.FieldValidate.Required = loc[requiredAtrr.ErrorMessage ?? "This field cann't be empty"].Value;
                }

                var groupAtrr = prop.GetCustomAttribute<FormFieldGroup>();
                if (groupAtrr != null)
                    field.Group = groupAtrr.Group;

                formFields.Add(field);
            }
            return formFields;
        }

        private static IEnumerable<TEntityDetail> ListToDetails<TEntityDetail>(IEnumerable<object> list, string group = null, string lang = null)
                        where TEntityDetail : BaseEntityDetail, new()
        {
            var entityDetails = new List<TEntityDetail>();

            var listType = list.GetType();
            var argumentType = listType.GetGenericArguments()[0];
            var argumentProps = argumentType.GetProperties();
            int i = 0;
            foreach (var value in list)
            {
                var prefix = i.ToString();
                foreach (var prop in argumentProps)
                {
                    var propName = prop.Name.FirstCharacterToLower();
                    var propType = prop.PropertyType;
                    var isGenericType = propType.GetTypeInfo().IsGenericType;

                    var propValueDic = value.ToDictionary<object>();
                    var propValue = propValueDic.ContainsKey(prop.Name) ? propValueDic[prop.Name] : null;
                    if (propValue != null)
                    {
                        if (IsClassAndNotString(propType))
                        {
                            var detailsFromProp = ViewModelToEntityDetails<TEntityDetail>(propValue, lang);
                            foreach (var detailFromProp in detailsFromProp)
                            {
                                detailFromProp.Group = group;
                                detailFromProp.Suffix = detailFromProp.Field;
                                detailFromProp.Field = propName;
                                detailFromProp.Prefix = prefix;
                            }
                            entityDetails.AddRange(detailsFromProp);
                        }
                        else if (isGenericType &&
                        (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                        propType.GetGenericTypeDefinition() == typeof(List<>))
                        )
                        {
                            entityDetails.AddRange(ListToDetails<TEntityDetail>(propValue as IEnumerable<object>, prop.Name.FirstCharacterToLower(), lang));
                        }
                        else
                        {
                            var entityDetail = new TEntityDetail()
                            {
                                Field = propName,
                                Group = group,
                                Prefix = prefix,
                                Value = propValue.ToString()
                            };
                            var localizationAttribute = prop.CustomAttributes.FirstOrDefault(o => o.AttributeType == typeof(FormFieldLocalizationAttribute));
                            if (localizationAttribute != null)
                                entityDetail.Language = lang;

                            entityDetails.Add(entityDetail);
                        }
                    }
                }
                i++;
            }

            return entityDetails;
        }

        public static IEnumerable<TEntityDetail> ViewModelToEntityDetails<TEntityDetail>(object details, string lang = null)
            where TEntityDetail : BaseEntityDetail, new()
        {
            var entityDetails = new List<TEntityDetail>();

            //BindingFlags.DeclaredOnly | BindingFlags.Public | BindingFlags.Instance
            var props = details.GetType().GetProperties();
            foreach (var prop in props)
            {
                var propType = prop.PropertyType;
                var typeInfo = propType.GetTypeInfo();

                if (!typeInfo.IsPublic)
                    continue;

                var propName = prop.Name.FirstCharacterToLower();

                var isGenericType = typeInfo.IsGenericType;
                var value = prop.GetValue(details);

                if (value != null)
                {
                    if (IsClassAndNotString(propType))
                    {
                        var propValue = prop.GetValue(details);
                        var detailsFormProp = ViewModelToEntityDetails<TEntityDetail>(propValue, lang);
                        foreach (var detailFormProp in detailsFormProp)
                        {
                            detailFormProp.Suffix = detailFormProp.Field;
                            detailFormProp.Field = propName;
                        }
                        entityDetails.AddRange(detailsFormProp);
                    }
                    else if (isGenericType &&
                    (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                    propType.GetGenericTypeDefinition() == typeof(List<>))
                    )
                    {
                        var values = value as IEnumerable<object>;
                        entityDetails.AddRange(ListToDetails<TEntityDetail>(values, propName, lang));
                    }
                    else
                    {
                        var entityDetail = new TEntityDetail()
                        {
                            Field = propName,
                            Value = value.ToString()
                        };

                        var localizationAttribute = prop.CustomAttributes.FirstOrDefault(o => o.AttributeType == typeof(FormFieldLocalizationAttribute));
                        if (localizationAttribute != null)
                            entityDetail.Language = lang;

                        entityDetails.Add(entityDetail);
                    }
                }
            }

            return entityDetails;
        }

        public static object CreateObjectFormEntityDetails<TEntityDetail>(Type argumentType, IEnumerable<TEntityDetail> entityDetails)
            where TEntityDetail : BaseEntityDetail
        {
            var instance = Activator.CreateInstance(argumentType);
            var props = argumentType.GetProperties();

            var bindAttribute = argumentType.GetTypeInfo().GetCustomAttribute<BindAttribute>();
            if (bindAttribute != null)
            {
                foreach (var prop in props)
                {
                    var eDetail = entityDetails.FirstOrDefault(o => o.Suffix == prop.Name.FirstCharacterToLower())?.Value;
                    prop.SetValue(instance, eDetail);
                }
            }
            else
                foreach (var prop in props)
                {
                    var propName = prop.Name.FirstCharacterToLower();
                    var propType = prop.PropertyType;
                    var isGenericType = propType.GetTypeInfo().IsGenericType;

                    if (IsClassAndNotString(propType))
                    {
                        var detailGroup = entityDetails.Where(o => o.Field == propName).ToList();
                        var obj = CreateObjectFormEntityDetails(propType, detailGroup);
                        prop.SetValue(instance, obj);
                    }
                    else if (isGenericType &&
                        (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) || propType.GetGenericTypeDefinition() == typeof(List<>)))
                        prop.SetValue(instance, EntityDetailsToFieldValues(propType.GetGenericArguments()[0], entityDetails, propName));
                    else
                        prop.SetValue(instance, entityDetails.FirstOrDefault(o => o.Field == propName)?.Value);
                }

            return instance;
        }

        private static object EntityDetailsToFieldValues<TEntityDetail>(Type argumentType, IEnumerable<TEntityDetail> entityDetails, string group)
            where TEntityDetail : BaseEntityDetail
        {
            var list = (System.Collections.IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(argumentType));

            var detailGroup = entityDetails.Where(o => o.Group == group).ToList();

            var i = 0;
            while (detailGroup.Count() > 0)
            {
                var detailsOfIndex = detailGroup.Where(o => o.Prefix == i.ToString());
                list.Add(CreateObjectFormEntityDetails(argumentType, detailsOfIndex));
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
                var propName = prop.Name.FirstCharacterToLower();
                var propType = prop.PropertyType;
                var typeInfo = propType.GetTypeInfo();
                var isGenericType = propType.GetTypeInfo().IsGenericType;

                if (IsClassAndNotString(propType))
                {
                    var detailGroup = entityDetails.Where(o => o.Field == propName).ToList();
                    var obj = CreateObjectFormEntityDetails(propType, detailGroup);
                    prop.SetValue(detail, obj);
                }

                else if (isGenericType &&
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
