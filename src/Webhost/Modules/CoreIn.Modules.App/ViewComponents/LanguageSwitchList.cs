using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CoreIn.Modules.App.ViewComponents
{
    [ViewComponent(Name = "CoreIn_Modules_App/LanguageSwitchList")]
    public class LanguageSwitchList : ViewComponent
    {
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
