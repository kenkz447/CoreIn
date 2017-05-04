using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CoreIn.Commons.EntityHelper
{
    public interface IEntityHelper<TEntity, TDetail>
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

        IQueryable<TDetail> Details(TEntity entity, CultureInfo cultureInfo = null);

        TDetail CreateDetail(TEntity entity, string field, object value, string group, string prefix, string suffix, User owner, DateTime? dateTime = null);

        IEnumerable<TDetail> CreateDetails(TEntity entity, Dictionary<string, string> detailDictionary, User owner, DateTime? dateTime = null);

        IEnumerable<TDetail> CreateDetails(TEntity entity, IEnumerable<TDetail> details, User owner = null, DateTime? dateTime = null);

        void UpdateDetails(TEntity entity, Dictionary<string, string> detailsDictionary, User byUser);

        void UpdateDetails(TEntity entity, IEnumerable<TDetail> details, User byUser);

        TEntity Add(TEntity entity, User user = null);

        void Delete(TEntity entity);

        string GenerateEntityName(string name);

        TEntity Update(TEntity entity);

        void SetContext(DbContext dbContext);
    }
}