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
        public static string GetCompare(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CompareAttribute)) as CompareAttribute;

            if (attr != null)
            {
                return attr.OtherProperty;
            }
            return null;
        }
        public static string GetCompareError(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(CompareAttribute)) as CompareAttribute;

            if (attr != null)
            {
                var name = GetDisplayAttribute(propertyInfo).Name;
                return attr.FormatErrorMessage(name);
            }
            return null;
        }

        public static string GetCompareFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => GetCompare(GetPropertyInfo(expression));
        public static string GetCompareErrorFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => GetCompareError(GetPropertyInfo(expression));
    }
}
