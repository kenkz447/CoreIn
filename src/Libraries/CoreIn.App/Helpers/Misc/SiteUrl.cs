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
        public static string SiteRootUrl(this IUrlHelper helper)
        {
            var context = helper.ActionContext.HttpContext;
            return $"{context.Request.Scheme}://{context.Request.Host}";
        }
    }
}
