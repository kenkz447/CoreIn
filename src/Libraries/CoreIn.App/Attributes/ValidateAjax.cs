using Microsoft.AspNetCore.Mvc.Filters;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace CoreIn.App.Attributes
{
    public class ValidateAjaxAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            var modelState = ((Controller)(filterContext.Controller)).ViewData.ModelState;

            if (!modelState.IsValid)
            {
                var errorModel =
                        from x in modelState.Keys
                        where modelState[x].Errors.Count > 0
                        select modelState[x].Errors.Select(y => y.ErrorMessage);
                filterContext.Result = new JsonResult(new { code = -1, message = "Check validate infomation!", errors = errorModel });
                filterContext.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
        }
    }
}
