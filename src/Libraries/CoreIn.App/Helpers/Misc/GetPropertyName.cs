using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace CoreIn.App.Helpers
{
    public static partial class Helper
    {
        public static string GetPropertyName<TModel>(Expression<Func<TModel, object>> expression)
        {
            var memberExpression = expression.Body as MemberExpression;
            var propertyName = ((memberExpression.Member is PropertyInfo) ? memberExpression.Member.Name : null);
            return propertyName;
        }
    }
}
