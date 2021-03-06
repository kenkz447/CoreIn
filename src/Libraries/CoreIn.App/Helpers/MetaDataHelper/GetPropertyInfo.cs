﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace CoreIn.App.Helpers
{
    public static partial class MetaDataHelper
    {
        public static PropertyInfo GetPropertyInfo<TModel>(Expression<Func<TModel, object>> expression)
        {
            var type = typeof(TModel);
            var propertyName = default(string);
            string[] properties = null;
            IEnumerable<string> propertyList;
            //unless it's a root property the expression NodeType will always be Convert
            switch (expression.Body.NodeType)
            {
                case ExpressionType.Convert:
                case ExpressionType.ConvertChecked:
                    var ue = expression.Body as UnaryExpression;
                    propertyList = (ue != null ? ue.Operand : null).ToString().Split(".".ToCharArray()).Skip(1); //don't use the root property
                    break;
                default:
                    propertyList = expression.Body.ToString().Split(".".ToCharArray()).Skip(1);
                    break;
            }

            //the propert name is what we're after
            propertyName = propertyList.Last();
            //list of properties - the last property name
            properties = propertyList.Take(propertyList.Count() - 1).ToArray(); //grab all the parent properties

            Expression expr = null;
            foreach (string property in properties)
            {
                var propertyInfo = type.GetProperty(property);
                expr = Expression.Property(expr, type.GetProperty(property));
                type = propertyInfo.PropertyType;
            }

            var propertyInfoResult = type.GetProperty(propertyName);
            return propertyInfoResult;
        }
    }
}
