using Microsoft.EntityFrameworkCore;

namespace CoreIn.Commons
{
    public interface ICustomModelBuilder
    {
        void Build(ModelBuilder modelBuilder);
    }
}
