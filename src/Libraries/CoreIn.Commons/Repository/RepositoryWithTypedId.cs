using Microsoft.EntityFrameworkCore;
using System.Linq;
using CoreIn.Models.Infrastructure;
using System.Linq.Expressions;
using System;

namespace CoreIn.Commons
{
    public class RepositoryWithTypedId<T, TId> : IRepositoryWithTypedId<T, TId> where T : class, IEntityWithTypedId<TId>
    {
        public void SetContext(DbContext context)
        {
            Context = context;
            DbSet = Context.Set<T>();
        }

        private DbContext Context { get; set; }

        private DbSet<T> DbSet { get; set; }

        public void Add(T entity)
        {
            DbSet.Add(entity);
        }

        public int SaveChange()
           => Context.SaveChanges();

        public IQueryable<T> Query()
        {
            return DbSet;
        }

        public IQueryable<T> Query(Expression<Func<T, bool>> @where)
        {
            return DbSet.Where(@where);
        }

        public void Delete(T entity)
        {
            DbSet.Remove(entity);
        }

        public void SetState(T entity, EntityState state)
            => Context.Entry(entity).State = state;

        public T GetById(TId id)
        {
            return DbSet.Find(id);
        }

        public T GetBy(Expression<Func<T,bool>> pre)
        {
            return DbSet.FirstOrDefault(pre);
        }

        public T Update(T entity)
        {
            DbSet.Attach(entity);
            var entry = Context.Entry(entity);
            entry.State = EntityState.Modified;
            return entity;
        }
    }
}