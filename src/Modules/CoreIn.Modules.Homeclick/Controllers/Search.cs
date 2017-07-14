using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.Homeclick.Controllers
{
    public class Search : Controller
    {
        public JsonResult Index(string search)
        {
            return Json(null);
        }
    }
}
