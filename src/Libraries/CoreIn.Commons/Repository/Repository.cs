using CoreIn.Models.Infrastructure;

namespace CoreIn.Commons
{
    public class Repository<T> : RepositoryWithTypedId<T, long>, IRepository<T>
        where T : class, IEntityWithTypedId<long>
    {
        public Repository(CoreInDbContext context) : base(context)
        {

        }
    }
}
