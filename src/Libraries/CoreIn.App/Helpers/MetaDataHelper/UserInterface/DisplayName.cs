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
        public static DisplayAttribute GetDisplayAttribute(PropertyInfo propertyInfo)
        {
            var attr = propertyInfo.GetCustomAttribute(typeof(DisplayAttribute), true) as DisplayAttribute;
            return attr;
        }
    }
}
