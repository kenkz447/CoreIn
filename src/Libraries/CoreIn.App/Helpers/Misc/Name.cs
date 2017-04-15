using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;

namespace Microsoft.AspNetCore.Mvc
{
    public static partial class Helper
    {
        public static string ControllerName(this IHtmlHelper hepler)
        {
            return ((Controllers.ControllerActionDescriptor)hepler.ViewContext.ActionDescriptor).ControllerName;
        }

        public static string ActionName(this IHtmlHelper hepler)
        {
            return ((Controllers.ControllerActionDescriptor)hepler.ViewContext.ActionDescriptor).ActionName;
        }
    }
}
