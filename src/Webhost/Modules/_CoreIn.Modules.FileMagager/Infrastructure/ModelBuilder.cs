using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CoreIn.Commons.DataProviver.Infrastructure;
using CoreIn.Commons.App.Models;

namespace CoreIn.Modules.App.Infrastructure
{
    public class AppModelBuilder : ICustomModelBuilder
    {
        public void Build(ModelBuilder modelBuilder)
        {
            #region [Menu]
            modelBuilder.Entity<Menu>()
                .HasIndex(e => e.Name)
                .IsUnique(true);

            modelBuilder.Entity<MenuDetail>()
                .HasOne(e => e.Menu)
                .WithMany(e => e.Details);

            modelBuilder.Entity<MenuItem>()
                .HasOne(e => e.Menu)
                .WithMany(e => e.Items);

            modelBuilder.Entity<MenuItem>()
                .HasOne(e => e.Parent)
                .WithMany(e => e.Children);

            modelBuilder.Entity<MenuItem>()
                .HasIndex(e => e.Name)
                .IsUnique(true);

            modelBuilder.Entity<MenuItemDetail>()
                .HasOne(e => e.MenuItem)
                .WithMany(e => e.Details);
            #endregion
        }
    }
}
