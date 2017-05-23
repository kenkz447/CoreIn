using System.Collections.Generic;
using System.Linq;
using CoreIn.Commons.EntityHelper;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Commons;
using System.Globalization;

namespace CoreIn.EntityCore
{
    public class MenuHelper : IMenuHelper
    {
        private readonly CoreInDbContext _dbContext;

        private readonly IEntityHelper<Menu, MenuDetail> _entityHelper;

        private readonly AppEntityTypes _appEntityTypes;

        public MenuHelper(CoreInDbContext dbContext, AppEntityTypes appEntityTypes, IEntityHelper<Menu, MenuDetail> entityHelper, IEntityTypeManager entityTypeManager)
        {
            _dbContext = dbContext;

            _appEntityTypes = appEntityTypes;

            _entityHelper = entityHelper;
            _entityHelper.SetContext(dbContext);
        }

        public Menu CreateMenuEntity(Menu entity, MenuDetail[] details, User byUser = null, bool saveAfterFinishing = true)
        {
            if (entity.Name == null || entity.Name == string.Empty)
                return null;

            var existingEntity = _entityHelper.Entity(entity.Name);

            //entity.EntityTypeId = entity.ParentId != null ? _appEntityTypes.TypeMenuItem.Id : _appEntityTypes.TypeMenu.Id;
            if (existingEntity == null)
            {
                existingEntity = _entityHelper.Add(entity, byUser);
                if (details != null)
                    existingEntity.Details = _entityHelper.CreateDetails(entity, details, byUser).ToList();
            }
            else if (details != null)
                _entityHelper.UpdateDetails(existingEntity, details, byUser);

            foreach (var child in entity.Children)
            {
                child.ParentId = existingEntity.Id;
            }

            if (saveAfterFinishing)
                Save();

            return existingEntity;
        }

        public Menu MenuItem(Menu menu, string name, Dictionary<string, string> detailDictionary, User byUser)
        {
            var item = _entityHelper.Entity(name);

            if (item == null)
            {
                item = _entityHelper.CreateEntity(_appEntityTypes.TypeMenuItem, menu, name, byUser);
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
            var menu = _entityHelper.CreateEntity(_appEntityTypes.TypeMenu, name, owner);

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
            var currentCult = CultureInfo.CurrentCulture;

            foreach (var menuChild in menu.Children)
            {
                menuChild.Children = _entityHelper.GetChildrenEntities(menuChild).ToList();
                menuChild.Details = _entityHelper.GetDetails(menuChild, currentCult).ToList();

                yield return new MenuViewModel(menuChild, GetMenuViewModelItems(menuChild));
            }
        }
    }
}
