using CoreIn.Models.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace CoreIn.Commons
{
    public interface IRepositoryWithTypedId<T, in TId> where T : IEntityWithTypedId<TId>
    {
        IQueryable<T> Query();

        IQueryable<T> Query(Expression<Func<T, bool>> pre);

        void Add(T entity);

        int AddAndSave(T entity);

        int SaveChange();

        int Delete(T entity);

        void SetState(T entity, EntityState state);

        T GetById(TId id);

        T GetBy(Expression<Func<T, bool>> pre);

        T UpdateAndSave(T entity);
    }
}
