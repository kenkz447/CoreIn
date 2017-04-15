using CoreIn.App.Attributes;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Linq.Expressions;
using System.Reflection;

namespace CoreIn.App.Helpers
{
    public static partial class MetaDataHelper
    {
        public static bool RequiredSpecialCharacter(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CustomRequiredSpecialCharAttribute)) as CustomRequiredSpecialCharAttribute;

            if (attr != null)
            {
                return true;
            }
            return false;
        }
        public static string RequiredSpecialCharacterError(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CustomRequiredSpecialCharAttribute)) as CustomRequiredSpecialCharAttribute;

            if (attr != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return attr.FormatErrorMessage(name);
            }
            return string.Empty;
        }

        public static bool RequiredSpecialCharacterFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredSpecialCharacter(GetPropertyInfo(expression));
        public static string RequiredSpecialCharacterErrorFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredSpecialCharacterError(GetPropertyInfo(expression));
    }
}
