using CoreIn.App.Attributes;
using Microsoft.AspNetCore.Mvc;
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
        public static string RenderAsType(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(RenderAsAttribute), true) as RenderAsAttribute;
            var result = RenderType.FormGroup;
            if (attr != null)
            {
                result = attr.RenderType;
            } else
            {
                if (propertyInfo.PropertyType == typeof(bool))
                    result = RenderType.Checkbox;
            }

            return result.ToString().ToLower();
        }
    }
}
