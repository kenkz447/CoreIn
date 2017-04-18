using System.Collections.Generic;
using System.Linq;
using CoreIn.Commons.EntityHelper;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Commons;

namespace CoreIn.EntityCore
{
    public class MenuHelper : IMenuHelper
    {
        private readonly CoreInDbContext _dbContext;

        private readonly IEntityHelper<Menu, MenuDetail> _entityHelper;

        private readonly EntityType TypeMenu;
        private readonly EntityType TypeMenuItem;

        public MenuHelper(CoreInDbContext dbContext, IEntityHelper<Menu, MenuDetail> entityHelper, IEntityTypeManager entityTypeManager)
        {
            _dbContext = dbContext;

            _entityHelper = entityHelper;
            _entityHelper.SetContext(dbContext);

            var entityTypeGroup = "Menu Entity";
            TypeMenu = entityTypeManager.RegisterEntityType("Menu", new Dictionary<string, string> { { "title", "Menu"}, { "group", entityTypeGroup } });
            TypeMenuItem = entityTypeManager.RegisterEntityType("MenuItem", new Dictionary<string, string> { { "title", "Menu Item" }, { "group", entityTypeGroup } });
        }

        public Menu MenuItem(Menu menu, string name, Dictionary<string, string> detailDictionary, User byUser)
        {
            var item = _entityHelper.Entity(name);

            if (item == null)
            {
                item = _entityHelper.CreateEntity(TypeMenuItem, menu, name, byUser);
                item.Details = _entityHelper.CreateDetails(item, detailDictionary, byUser).ToList();
            }
            else
            {
                _entityHelper.UpdateDetails(item, detailDictionary, byUser);
            }

            Save();

            return item;
        }

        public Menu Menu(string name, Dictionary<string, string> detailDictionary, Menu[] items, User owner)
        {
            var menu = _entityHelper.CreateEntity(TypeMenu, name, owner);

            if (detailDictionary == null)
                detailDictionary = new Dictionary<string, string>();

            _entityHelper.CreateDetails(menu, detailDictionary, owner);

            menu.Children = items;

            Save();

            return menu;
        }

        public Menu Menu(string name)
            => _entityHelper.Entity(name);

        private int Save()
          => _dbContext.SaveChanges();


        public MenuViewModel GetMenuViewModel(string menuName)
        {
            var menu = _entityHelper.Entity(menuName);
            menu.Children = _entityHelper.GetChildrenEntities(menu).ToList();

            var viewModel = new MenuViewModel(menu, GetMenuViewModelItems(menu));

            return viewModel;
        }

        private IEnumerable<MenuViewModel> GetMenuViewModelItems(Menu menu)
        {
            foreach (var menuChild in menu.Children)
            {
                menuChild.Children = _entityHelper.GetChildrenEntities(menuChild).ToList();
                menuChild.Details = _entityHelper.Details(menuChild).ToList();
                yield return new MenuViewModel(menuChild, GetMenuViewModelItems(menuChild));
            }
        }
    }
}
