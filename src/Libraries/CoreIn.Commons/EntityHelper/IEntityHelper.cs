using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;

namespace CoreIn.Commons.EntityHelper
{
    public interface IEntityHelper<TEntity, out TDetail>
        where TEntity : BaseEntity
    {
        TEntity Entity(long id);

        TEntity Entity(string name);

        IQueryable<TEntity> Entities();

        IQueryable<TEntity> GetChildrenEntities(TEntity parentEntity);

        TEntity CreateEntity(string name, User owner, DateTime? created = null);

        TEntity CreateEntity(EntityType entityType,string name, User owner, DateTime? created = null);

        TEntity CreateEntity(TEntity parentEntity, string name, User owner, DateTime? created = null);

        TEntity CreateEntity(EntityType entityType, TEntity parentEntity, string name, User owner, DateTime? created = null);

        TDetail Detail(TEntity entity, string name);

        IQueryable<TDetail> Details(TEntity entity);

        TDetail CreateDetail(TEntity entity, string field, object value, User owner, DateTime? dateTime = null);

        IEnumerable<TDetail> CreateDetails(TEntity entity, Dictionary<string, string> detailDictionary, User owner, DateTime? dateTime = null);

        int UpdateDetails(TEntity entity, Dictionary<string, string> detailsDictionary, User byUser);

        int Add(TEntity entity);

        int Delete(TEntity entity);

        string GenerateEntityName(string name);

        TEntity Update(TEntity entity);
    }
}