using System.Collections.Generic;

namespace CoreIn.Models.Infrastructure
{
    public interface IEntityWithDetails<TDetail>
        where TDetail: BaseEntityDetail
    {
        ICollection<TDetail> Details { get; set; }
    }
}
