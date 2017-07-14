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
    /// <summary>
    /// Class này chịu trách nhiệm chuyển đổi từ viewModel sang entity details và ngược lại
    /// </summary>
    public static class FormUtitities
    {
        private static bool IsClassAndNotString(Type propType)
        {
            var typeInfo = propType.GetTypeInfo();
            return propType != typeof(string) && !typeInfo.IsPrimitive && !typeInfo.IsGenericType && typeInfo.IsClass;
        }

        /// <summary>
        /// Lấy TẤT CẢ(3 đời bao gồm cháu chắt, ez) group con có trong properties
        /// </summary>
        /// <param name="argumentType"></param>
        /// <returns></returns>
        public static List<String> GetAllChildrenGroup(Type argumentType)
        {
            var result = new List<string>();

            var props = argumentType.GetProperties();
            foreach (var prop in props)
            {
                var propName = prop.Name.FirstCharacterToLower();
                var propType = prop.PropertyType;
                var typeInfo = propType.GetTypeInfo();
                var isGenericType = propType.GetTypeInfo().IsGenericType;

                if (isGenericType && (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) || propType.GetGenericTypeDefinition() == typeof(List<>)))
                {
                    argumentType = propType.GetGenericArguments()[0];
                    result.Add(propName);
                    result.AddRange(GetAllChildrenGroup(argumentType));
                }
            }
            return result;
        }

        /// <summary>
        /// Chuyển đổi UI của FieldDisplay sang ngôn ngữ hiện tại
        /// </summary>
        /// <typeparam name="TLoc"></typeparam>
        /// <param name="fieldDisplay"></param>
        /// <param name="loc"></param>
        /// <returns></returns>
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

        private static IEnumerable<TEntityDetail> ListToDetails<TEntityDetail>(IEnumerable<object> list, string group = null, string lang = null, string parentTempId = null)
                        where TEntityDetail : BaseEntityDetail, new()
        {
            var entityDetails = new List<TEntityDetail>();

            var listType = list.GetType();
            var argumentType = listType.GetGenericArguments()[0];
            var argumentProps = argumentType.GetProperties();

            if (parentTempId != null && parentTempId.Contains("/"))
                parentTempId = parentTempId.Split('/')[1];

            if (parentTempId == null)
                parentTempId = Guid.NewGuid().ToString();

            int i = 0;
            foreach (var value in list)
            {
                var prefix = i;
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
                                detailFromProp.Prefix = i.ToString();
                                detailFromProp.TempId = parentTempId;
                            }
                            entityDetails.AddRange(detailsFromProp);
                        }
                        else if (isGenericType &&
                        (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                        propType.GetGenericTypeDefinition() == typeof(List<>))
                        )
                        {
                            var newTemp = parentTempId + "/" + Guid.NewGuid().ToString();
                            var entityDetail = new TEntityDetail()
                            {
                                Field = propName,
                                Group = group,
                                Value = "List[]",
                                Prefix = i.ToString(),
                                TempId = newTemp
                            };
                            entityDetails.Add(entityDetail);
                            entityDetails.AddRange(ListToDetails<TEntityDetail>(propValue as IEnumerable<object>, propName, lang, newTemp));
                        }
                        else
                        {
                            var entityDetail = new TEntityDetail()
                            {
                                Field = propName,
                                Group = group,
                                Value = propValue.ToString(),
                                Prefix = i.ToString(),
                                TempId = parentTempId
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
                        
                        var list = ListToDetails<TEntityDetail>(values, propName, lang);
                        entityDetails.AddRange(list);
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

        public static object CreateObjectFormEntityDetails<TEntityDetail>(Type argumentType, IEnumerable<TEntityDetail> entityDetails, string tempId = null)
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
                    {
                        if (entityDetails.FirstOrDefault(o => o.Group == propName) != null)
                            prop.SetValue(instance, EntityDetailsToFieldValues(propType.GetGenericArguments()[0], entityDetails, propName, tempId));
                    }
                    else
                        prop.SetValue(instance, entityDetails.FirstOrDefault(o => o.Field == propName)?.Value);
                }

            return instance;
        }

        /// <summary>
        /// Chuyển đổi Entity Details sang object(list member) cụ thể.
        /// </summary>
        /// <typeparam name="TEntityDetail"></typeparam>
        /// <param name="argumentType"></param>
        /// <param name="entityDetails"></param>
        /// <param name="group"></param>
        /// <param name="parentTempId"></param>
        /// <returns></returns>
        private static object EntityDetailsToFieldValues<TEntityDetail>(Type argumentType, IEnumerable<TEntityDetail> entityDetails, string group, string parentTempId = null)
            where TEntityDetail : BaseEntityDetail
        {
            //Tạo instance
            var list = (System.Collections.IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(argumentType));

            //Tham số để lọc entityDetails theo group hiện tại và bao gồm tất cả các group con
            //Trong properties của type không thể chứa 2 list
            var filterGroups = new List<string>() { group };
            var filterChildren = GetAllChildrenGroup(argumentType);
            filterGroups.AddRange(filterChildren);

            var detailGroup = entityDetails.Where(o => filterGroups.Contains(o.Group)).ToList();

            //Đây là index của object trong list
            var arrayIndex = 0;

            while (arrayIndex >= 0)
            {
                //Only details có group và index trùng, là các detail chứa giá trị của object hiện tại.
                var currentIndexDetails = parentTempId == null ? detailGroup.Where(o => o.Group == group && o.Prefix == arrayIndex.ToString()).ToList() :
                detailGroup.Where(o => o.Group == group && o.TempId.StartsWith(parentTempId) && o.Prefix == arrayIndex.ToString()).ToList();

                //Cứ tiến lên, hết rồi thì sẽ dừng
                if (currentIndexDetails.Count() == 0)
                    break;

                //tempId để nhận diện các details con trong cùng index
                string tempId = null;

                //Tìm xem có list nào trong, nếu là list thì tempId sẽ có dạng 'xxxx/yyyy'
                //xxxx là tempId của thằng cha, yyyy là nhận diện của list hiện tại. 
                //Sau này ai đọc đéo hiểu cũng chịu :)))
                var listDetail = currentIndexDetails.FirstOrDefault(o => o.TempId != null && o.TempId.Contains('/'));
                if (listDetail != null)
                {
                    tempId = listDetail.TempId;
                    if (tempId != null && tempId.Contains("/"))
                        tempId = tempId.Split('/')[1];
                }

                //Lọc ra các entity details có liên quan đến object hiện tại
                foreach (var fiter in filterChildren)
                {
                    var adds = detailGroup.Where(o => o.Group != group && o.Group == fiter);
                    foreach (var item in adds)
                    {
                        var groupDetail = currentIndexDetails.FirstOrDefault(o => o.Field == item.Group && o.TempId.EndsWith(item.TempId.Split('/').FirstOrDefault()));
                        if (groupDetail != null)
                            currentIndexDetails.Add(item);
                    }
                }

                list.Add(CreateObjectFormEntityDetails(argumentType, currentIndexDetails, tempId));
                arrayIndex++;
            }

            return list;
        }


        /// <summary>
        /// Chuyển đổi entity details sang class
        /// </summary>
        /// <typeparam name="TEntityDetail"></typeparam>
        /// <typeparam name="TDetail"></typeparam>
        /// <param name="entityDetails"></param>
        /// <returns></returns>
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

                if (isGenericType &&
                    (propType.GetGenericTypeDefinition() == typeof(IEnumerable<>) || propType.GetGenericTypeDefinition() == typeof(List<>)))
                {
                    var argumentType = propType.GetGenericArguments()[0];

                    prop.SetValue(detail, EntityDetailsToFieldValues(argumentType, entityDetails, propName));
                }
                else
                {
                    var detailGroup = entityDetails.Where(o => o.Field == propName && o.Group == null).ToList();

                    if (IsClassAndNotString(propType))
                    {
                        var obj = CreateObjectFormEntityDetails(propType, detailGroup);
                        prop.SetValue(detail, obj);
                    }
                    else 
                        prop.SetValue(detail, detailGroup.FirstOrDefault()?.Value);
                }
            }

            return detail;
        }
    }
}
