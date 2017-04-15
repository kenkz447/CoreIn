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
        public static bool RequiredLowercase(PropertyInfo propertyInfo)
        {
            var customRequiredLowerAttribute = propertyInfo.GetCustomAttribute(typeof(CustomRequiredLowerAttribute)) as CustomRequiredLowerAttribute;

            if (customRequiredLowerAttribute != null)
            {
                return true;
            }
            return false;
        }
        public static string RequiredLowercaseError(PropertyInfo propertyInfo)
        {
            var customRequiredLowerAttribute = propertyInfo.GetCustomAttribute(typeof(CustomRequiredLowerAttribute)) as CustomRequiredLowerAttribute;

            if (customRequiredLowerAttribute != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return customRequiredLowerAttribute.FormatErrorMessage(name);
            }
            return string.Empty;
        }

        public static bool RequiredLowercaseFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredLowercase(GetPropertyInfo(expression));
        public static string RequiredLowercaseErrorFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredLowercaseError(GetPropertyInfo(expression));
    }
}
