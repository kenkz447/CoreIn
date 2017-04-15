using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata.Conventions.Internal;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CoreIn.Models
{
    public class Menu : BaseEntity
    {
        public Menu()
        {
            this.Details = new HashSet<MenuDetail>();
            this.Children = new HashSet<Menu>();
        }

        [ForeignKey("ParentId")]
        public virtual Menu Parent { get; set; }

        public virtual  ICollection<MenuDetail> Details { get; set; }

        public virtual ICollection<Menu> Children { get; set; }
    }
}