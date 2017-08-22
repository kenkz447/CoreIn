using CoreIn.Commons;
using CoreIn.Modules.Post.Models;
using Microsoft.EntityFrameworkCore;

namespace CoreIn.Modules.Post
{
    public class AppModelBuilder : ICustomModelBuilder
    {
        public void Build(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PostEntity>()
                .HasAlternateKey(o => o.Name);
        }
    }
}