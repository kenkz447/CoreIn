using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using System.Reflection;
using Microsoft.AspNetCore.Mvc.Razor;
using CoreIn.Commons.Modular.Infrastructure;
using Autofac;
using CoreIn.Commons.DataProviver.Infrastructure;
using CoreIn.Commons.DataProviver.Domain;
using Microsoft.Extensions.Logging;
using CoreIn.Commons.App.Models;
using CoreIn.Modules.FileMagager.Resources;

namespace CoreIn.Modules.FileMagager
{
    public class ModularInitializer : IModuleInitializer
    {
        public void initDatabase(CoreInDbContext context)
        {
            IRepository<Menu> menuRepository = new Repository<Menu>(context);
            IRepository<MenuItem> menuItemRepository = new Repository<MenuItem>(context);
            IRepository<MenuItemDetail> menuItemDetailRepository = new Repository<MenuItemDetail>(context);

            var mainMenu = menuRepository.GetBy(e => e.Name == Commons.App.Resoures.Key.AppMenuName);
            var menuItem = menuItemRepository.GetBy(e => e.Name == Key.MAIN_MENU_ITEM) ?? new MenuItem();
            var menuItemDetail_Icon = menuItemDetailRepository.Query().Where(e => e.MenuItemId == menuItem.Id && e.Field == "icon").FirstOrDefault() ?? new MenuItemDetail();

            menuItem.Name = Key.MAIN_MENU_ITEM;
            menuItem.Title = "File Manager";
            menuItem.Area = "Admin";
            menuItem.Controller = "FileManager";
            menuItem.Action = "Index";
            menuItem.Menu = mainMenu;

            menuItemDetail_Icon.Field = "icon";
            menuItemDetail_Icon.Value = "<i class=\"fa fa-folder-open\" aria-hidden=\"true\"></i>";
            menuItemDetail_Icon.MenuItem = menuItem;

            if (menuItem.Id == 0)
                menuItemRepository.Add(menuItem);

            if (menuItemDetail_Icon.Id == 0 )
                menuItemDetailRepository.Add(menuItemDetail_Icon);

            menuItemRepository.SaveChange();
            menuItemDetailRepository.SaveChange();
        }

        public void Init(IServiceCollection services)
        {
            var serviceProvider = services.BuildServiceProvider();
            var context = serviceProvider.GetService<CoreInDbContext>();
            this.initDatabase(context);
        }
    }
}
