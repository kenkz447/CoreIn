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
        private static string FieldType(PropertyInfo propertyInfo)
        {
            var dataTypeAttribute = propertyInfo.GetCustomAttribute(typeof(DataTypeAttribute)) as DataTypeAttribute;
            if (dataTypeAttribute != null)
            {
                var dataType = dataTypeAttribute.DataType;

                switch (dataType)
                {
                    case DataType.EmailAddress:
                        return "email";
                    default:
                        return dataType.ToString().ToLower();
                }
            }
            return string.Empty;
        }

        public static string FieldTypeFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression) => FieldType(GetPropertyInfo(expression));
    }
}
