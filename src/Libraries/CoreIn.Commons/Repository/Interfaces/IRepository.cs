using CoreIn.Models.Infrastructure;

namespace CoreIn.Commons
{
    public interface IRepository<T> : IRepositoryWithTypedId<T, long> where T : IEntityWithTypedId<long>
    {
    }
}
