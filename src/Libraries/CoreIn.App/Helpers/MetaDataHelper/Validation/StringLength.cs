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
        public static int? MaxLength(PropertyInfo propertyInfo)
        {
            var stringLengthAttribute = propertyInfo.GetCustomAttribute(typeof(CustomStringLengthAttribute)) as CustomStringLengthAttribute;
            if (stringLengthAttribute != null && stringLengthAttribute.MaximumLength != 0)
            {
                return stringLengthAttribute.MaximumLength;
            }
            return null;
        }
        public static int? MinLength(PropertyInfo propertyInfo)
        {
            var stringLengthAttribute = propertyInfo.GetCustomAttribute(typeof(CustomStringLengthAttribute)) as CustomStringLengthAttribute;
            if (stringLengthAttribute != null && stringLengthAttribute.MinimumLength != 0)
            {
                return stringLengthAttribute.MinimumLength;
            }
            return null;
        }
        public static string StringLengthError(PropertyInfo propertyInfo)
        {
            var stringLengthAttribute = propertyInfo.GetCustomAttribute(typeof(CustomStringLengthAttribute)) as CustomStringLengthAttribute;
            if (stringLengthAttribute != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return stringLengthAttribute.FormatErrorMessage(name);
            }
            return null;
        }

        public static int? MaxLengthFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => MaxLength(GetPropertyInfo(expression));
        public static int? MinLengthFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => MinLength(GetPropertyInfo(expression));
        public static string StringLengthErrorFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => StringLengthError(GetPropertyInfo(expression));
    }
}