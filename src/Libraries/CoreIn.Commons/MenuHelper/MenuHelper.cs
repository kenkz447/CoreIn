using System.Collections.Generic;
using System.Linq;
using CoreIn.Commons.EntityHelper;
using CoreIn.Models;
using CoreIn.Models.Authentication;

namespace CoreIn.Commons
{
    public class MenuHelper : IMenuHelper
    {
        private readonly IRepository<Menu> _menuRepository;
        private readonly IEntityHelper<Menu, MenuDetail> _entityHelper;

        private EntityType TypeMenu { get; }
        private EntityType TypeMenuItem { get; }

        public MenuHelper(IRepository<Menu> menuRepository, IEntityHelper<Menu, MenuDetail> entityHelper, IEntityTypeManager entityTypeManager)
        {
            _menuRepository = menuRepository;
            _entityHelper = entityHelper;

            var entityTypeGroup = "Menu Entity";
            TypeMenu = entityTypeManager.EntityType("Menu", entityTypeGroup);
            TypeMenuItem = entityTypeManager.EntityType("MenuItem", entityTypeGroup);
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
            return item;
        }

        public Menu Menu(string name, Dictionary<string, string> detailDictionary, Menu[] items, User owner)
        {
            var menu = _entityHelper.CreateEntity(TypeMenu, name, owner);

            if (detailDictionary == null)
                detailDictionary = new Dictionary<string, string>();

            _entityHelper.CreateDetails(menu, detailDictionary, owner);

            menu.Children = items;

            return menu;
        }

        public Menu Menu(string name)
            => _entityHelper.Entity(name);

        public void SaveMenu(Menu menu)
        {
            _menuRepository.AddAndSave(menu);
        }

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
