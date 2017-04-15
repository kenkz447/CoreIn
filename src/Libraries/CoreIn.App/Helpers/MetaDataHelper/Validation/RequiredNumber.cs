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
        public static bool RequiredContainNumber(PropertyInfo propertyInfo)
        {
            var customRequiredNumberAttribute = propertyInfo.GetCustomAttribute(typeof(CustomRequiredNumberAttribute)) as CustomRequiredNumberAttribute;

            if (customRequiredNumberAttribute != null)
            {
                return true;
            }
            return false;
        }

        public static string RequiredContainNumberError(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CustomRequiredNumberAttribute)) as CustomRequiredNumberAttribute;

            if (attr != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return attr.FormatErrorMessage(name);
            }
            return string.Empty;
        }

        public static bool RequiredContainNumberFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredContainNumber(GetPropertyInfo(expression));
        public static string RequiredContainNumberErrorMessageFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => RequiredContainNumberError(GetPropertyInfo(expression));
    }
}
