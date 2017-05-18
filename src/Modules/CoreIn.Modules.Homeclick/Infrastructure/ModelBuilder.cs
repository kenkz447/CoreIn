using CoreIn.Commons;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.EntityFrameworkCore;

namespace CoreIn.Modules.Homeclick
{
    public class AppModelBuilder : ICustomModelBuilder
    {
        public void Build(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>();
            modelBuilder.Entity<Collection>();
            modelBuilder.Entity<Page>();
            modelBuilder.Entity<DesignTemplate>();
            modelBuilder.Entity<Album>();
        }
    }
}