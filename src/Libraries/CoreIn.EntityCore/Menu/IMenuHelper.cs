using System.Collections.Generic;
using CoreIn.Models;
using CoreIn.Models.Authentication;

namespace CoreIn.EntityCore
{
    public interface IMenuHelper
    {
        MenuViewModel GetMenuViewModel(string menuName);

        Menu CreateMenuEntity(Menu entity, MenuDetail[] details, User byUser = null, bool saveAfterFinishing = true);

        Menu MenuItem(Menu menu, string name, Dictionary<string, string> detailDictionary, User byUser);

        Menu Menu(string name, Dictionary<string, string> detailDictionary, Menu[] items, User owner);

        Menu Menu(string name);
    }
}
