using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.App.ViewComponents
{
    [ViewComponent(Name = "CoreIn_Modules_App/Appbar")]
    public class Appbar : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
