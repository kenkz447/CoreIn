using CoreIn.Models;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.EntityCore
{
    public class AppEntityTypes
    {
        public readonly EntityType TypeMenu;
        public readonly EntityType TypeMenuItem;

        public AppEntityTypes(IEntityTypeManager entityTypeManager)
        {
            var entityTypeGroup = "Menu Entity";
            TypeMenu = entityTypeManager.RegisterEntityType("Menu", new Dictionary<string, string> { { "title", "Menu" }, { "group", entityTypeGroup } });
            TypeMenuItem = entityTypeManager.RegisterEntityType("MenuItem", new Dictionary<string, string> { { "title", "Menu Item" }, { "group", entityTypeGroup } });
        }
    }
}
