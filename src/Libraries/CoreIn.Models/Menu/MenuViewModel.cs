using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CoreIn.Models
{
    public class MenuViewModel
    {
        public long Id { get;}
        public string Name { get; }
        public bool IsCurrent { get; set; }
        public bool HasCurrentChild { get; set; }
        public bool Level { get; set; }
        public IEnumerable<MenuViewModel> Items { get; }
        public Dictionary<string, string> Details { get;}

        public string Url
        {
            get
            {
                return Details["url"];
            }
        }

        public string Title
        {
            get
            {
                return Details["title"];
            }
        }

        public int? Order
        {
            get
            {
                return Details.ContainsKey("Order") ? int.Parse(Details["Order"]) : 0;
            }
        }

        public MenuViewModel(Menu menu, IEnumerable<MenuViewModel> items)
        {
            Id = menu.Id;
            Name = menu.Name;
            Items = items;
            Details = menu.Details.ToDictionary(o => o.Field, o => o.Value);
        }
    }
}
