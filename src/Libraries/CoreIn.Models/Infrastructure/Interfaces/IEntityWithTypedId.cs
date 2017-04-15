using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Models.Infrastructure
{
    public interface IEntityWithTypedId<TId>
    {
        TId Id { get; }
    }
}
