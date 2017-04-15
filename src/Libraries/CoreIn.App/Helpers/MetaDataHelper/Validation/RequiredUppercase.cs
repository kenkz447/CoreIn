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
        public static bool RequiredUppercase(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CustomRequiredUpperAttribute)) as CustomRequiredUpperAttribute;
            return attr != null;
        }

        public static string RequiredUppercaseError(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CustomRequiredUpperAttribute)) as CustomRequiredUpperAttribute;

            if (attr != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return attr.FormatErrorMessage(name);
            }
            return null;
        }

        public static bool RequiredUppercaseFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredUppercase(GetPropertyInfo(expression));
        public static string RequiredUppercaseErrorFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredUppercaseError(GetPropertyInfo(expression));
    }
}
