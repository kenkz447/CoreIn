using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Reflection;
using CoreIn.App.Attributes;
using Microsoft.AspNetCore.Mvc.Controllers;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace CoreIn.App.Helpers
{
    public static class AttributeExtensions
    {
        public static string GetControllerTitle(this ViewContext that)
        {
            var controllerActionDescriptor = ((ControllerActionDescriptor)that.ActionDescriptor);
            var customAttributes = controllerActionDescriptor.ControllerTypeInfo.GetCustomAttributes();
            var titleAttribute = customAttributes.Where(o => o is TitleAttribute).FirstOrDefault() as TitleAttribute;
            return titleAttribute?.Title ?? controllerActionDescriptor.ControllerName;
        }

        public static string GetActionTitle(this ViewContext that)
        {
            var controllerActionDescriptor = ((ControllerActionDescriptor)that.ActionDescriptor);
            var customAttributes = controllerActionDescriptor.MethodInfo.GetCustomAttributes();
            var titleAttribute = customAttributes.Where(o => o is TitleAttribute).FirstOrDefault() as TitleAttribute;
            return titleAttribute?.Title ?? controllerActionDescriptor.ActionName;
        }
    }
}
