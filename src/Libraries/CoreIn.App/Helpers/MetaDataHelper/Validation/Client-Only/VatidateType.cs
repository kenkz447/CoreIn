using CoreIn.App.Attributes;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;

namespace CoreIn.App.Helpers
{
    public static partial class MetaDataHelper
    {
        public static string FieldClientValidateType(PropertyInfo propertyInfo)
        {
            var dataTypeAttribute = propertyInfo.GetCustomAttribute(typeof(ValidateTypeAttribute)) as ValidateTypeAttribute;
            if (dataTypeAttribute != null)
            {
                var dataType = dataTypeAttribute.DataType;
                var result = string.Empty;
                switch (dataType)
                {
                    case DataType.EmailAddress:
                        result = "email";
                        break;
                    default:
                        return dataType.ToString();
                }
                return result.ToLower();
            }
            return null;
        }
        public static string FieldClientValidateTypeError(PropertyInfo propertyInfo)
        {
            var dataTypeAttribute = propertyInfo.GetCustomAttribute(typeof(ValidateTypeAttribute)) as ValidateTypeAttribute;

            if (dataTypeAttribute != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return dataTypeAttribute.FormatErrorMessage(name);
            }
            return null;
        }

        public static string FieldClientValidateTypeFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => FieldClientValidateType(GetPropertyInfo(expression));
        public static string FieldClientValidateTypeErrorFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => FieldClientValidateTypeError(GetPropertyInfo(expression));
    }
}
