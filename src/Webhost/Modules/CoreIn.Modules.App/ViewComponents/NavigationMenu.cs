using System.Collections.Generic;
using CoreIn.Commons;
using CoreIn.Models;
using CoreIn.Resources.ConstantKeys;
using Microsoft.AspNetCore.Mvc;
using CoreIn.EntityCore;

namespace CoreIn.Modules.App.ViewComponents
{
    [ViewComponent(Name = "CoreIn_Modules_App/NavigationMenu")]
    public class NavigationMenu : ViewComponent
    {
        private readonly IMenuHelper _menuHelper;

        public NavigationMenu(IMenuHelper menuHelper)
        {
            _menuHelper = menuHelper;
        }

        private void CheckCurrent(MenuViewModel menuViewModel)
        {
            var menuUrl = Url.Action(menuViewModel.Details.GetValue("controller"),
                menuViewModel.Details.GetValue("action"));
            if (Url.Action() == menuUrl)
            {

            }

            foreach (var item in menuViewModel.Items)
            {
                if (item.Items != null)
                    CheckCurrent(item);
            }
        }

        public IViewComponentResult Invoke(MenuViewModel menuViewModel = null, object args = null)
        {
            ViewData["Args"] = args.ToDictionary<string>();
            if (menuViewModel == null)
            {
                menuViewModel = _menuHelper.GetMenuViewModel(AppKey.AppMenuName);
                CheckCurrent(menuViewModel);
            }

            return View(menuViewModel);
        }
    }
}
