using System.Collections.Generic;

namespace CoreIn.Models.Infrastructure
{
    public interface IBaseEntityWithDetails<TDetail>
        where TDetail: BaseEntityDetail
    {
        ICollection<TDetail> Details { get; set; }
    }
}
