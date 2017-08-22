using CoreIn.Commons;
using CoreIn.Modules.Homeclick.Models;
using Microsoft.EntityFrameworkCore;

namespace CoreIn.Modules.Homeclick
{
    public class AppModelBuilder : ICustomModelBuilder
    {
        public void Build(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Project>()
                .HasAlternateKey(o => o.Name);

            modelBuilder.Entity<Collection>()
                .HasAlternateKey(o => o.Name);

            modelBuilder.Entity<Page>()
                .HasAlternateKey(o => o.Name);

            modelBuilder.Entity<Album>()
                .HasAlternateKey(o => o.Name);
        }
    }
}