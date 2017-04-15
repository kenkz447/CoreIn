using CoreIn.App.Attributes;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.ComponentModel.DataAnnotations;
using System.Linq.Expressions;
using System.Reflection;

namespace CoreIn.App.Helpers
{
    public static partial class MetaDataHelper
    {
        private static bool HasRequired(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CustomRequiredAttribute)) as CustomRequiredAttribute;
            if (attr != null)
            {
                return true;
            }
            return false;
        }
        private static string HasRequiredError(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CustomRequiredAttribute)) as CustomRequiredAttribute;

            if (attr != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return attr.FormatErrorMessage(name);
            }
            return null;
        }

        public static bool HasRequiredFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => HasRequired(GetPropertyInfo(expression));
        public static string HasRequiredErrorMessageFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => HasRequiredError(GetPropertyInfo(expression));
    }
}