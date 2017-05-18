using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CoreIn.App.ViewModels;

namespace CoreIn.Modules.App.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            var ViewModel = new ActionViewModel("Dashboard");
            return View(ViewModel);
        }
    }
}