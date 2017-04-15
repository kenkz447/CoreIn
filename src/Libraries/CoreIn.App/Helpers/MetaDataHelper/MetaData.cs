using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Threading.Tasks;
using CoreIn.App.ViewModels;

namespace CoreIn.App.Helpers
{
    public static partial class MetaDataHelper
    {
        #region[Validation]
        private static object validateRequired(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = HasRequired(propertyInfo),
                error = HasRequiredError(propertyInfo)
            };

            return result.value ? result : null;
        }
        private static object validateType(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = FieldClientValidateType(propertyInfo),
                error = FieldClientValidateTypeError(propertyInfo)
            };

            return result.value != null ? result : null;
        }
        private static object validateMinLength(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = MinLength(propertyInfo),
                error = StringLengthError(propertyInfo)
            };

            return result.value != null ? result : null;
        }
        private static object validateMaxLength(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = MaxLength(propertyInfo),
                error = StringLengthError(propertyInfo)
            };

            return result.value != null ? result : null;
        }
        private static object validateLowercase(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = RequiredLowercase(propertyInfo),
                error = RequiredLowercaseError(propertyInfo)
            };

            return result.value ? result : null;
        }

        private static object validateUppercase(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = RequiredUppercase(propertyInfo),
                error = RequiredUppercaseError(propertyInfo)
            };

            return result.value ? result : null;
        }

        private static object validateRequiredContainNumber(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = RequiredContainNumber(propertyInfo),
                error = RequiredContainNumberError(propertyInfo)
            };

            return result.value ? result : null;
        }
        private static object validateSpecialChar(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = RequiredSpecialCharacter(propertyInfo),
                error = RequiredSpecialCharacterError(propertyInfo)
            };

            return result.value ? result : null;
        }

        private static object validateCompare(PropertyInfo propertyInfo)
        {
            var result = new
            {
                value = GetCompare(propertyInfo)?.ToLower(),
                error = GetCompareError(propertyInfo)
            };

            return result.value != null ? result : null;
        }
        #endregion

        private static object validate(PropertyInfo propertyInfo)
        {
            var result = new
            {
                required = validateRequired(propertyInfo),
                type = validateType(propertyInfo),
                minLength = validateMinLength(propertyInfo),
                maxLength = validateMaxLength(propertyInfo),
                containLower = validateLowercase(propertyInfo),
                containUpper = validateUppercase(propertyInfo),
                containSpecial = validateSpecialChar(propertyInfo),
                containNumber = validateRequiredContainNumber(propertyInfo),
                compare = validateCompare(propertyInfo)
            };
            return result;
        }

        private static object display(PropertyInfo propertyInfo)
        {
            var displayAttribute = GetDisplayAttribute(propertyInfo);
            var result = new
            {
                renderType = RenderAsType(propertyInfo),
                //id = helper.IdFor(propertyInfo),
                type = FieldType(propertyInfo),
                displayName = displayAttribute.GetName(),
                label = displayAttribute.GetShortName(),
                placeholder = displayAttribute.GetDescription(),
                prompt = displayAttribute.GetPrompt(),
            };

            return result;
        }

        public static FieldViewModel ReactDataFor(PropertyInfo propertyInfo, object instance)
        {
            var result = new FieldViewModel()
            {
                Input = new Dictionary<string, object>()
                {
                    {"name", propertyInfo.Name.ToLower()},
                    {"value", propertyInfo.GetValue(instance)}
                },
                Validate = validate(propertyInfo),
                Display = display(propertyInfo)
            };

            return result;
        }

        public static object ReactDataFor<TModel>(this IHtmlHelper<TModel> helper, Expression<Func<TModel, object>> expression, object value = null)
        {
            var propertyInfo = GetPropertyInfo(expression);
            var name = helper.NameFor(expression).ToLower();
            dynamic result = new {
                input = new
                {
                    name = name,
                    value = value,
                },
                validate = validate(propertyInfo),
                display = display(propertyInfo)
            };
            return result;
        }
    }
}
