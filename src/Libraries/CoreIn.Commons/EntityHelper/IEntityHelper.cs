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

        TDetail GetDetail(TEntity entity, string name);

        IQueryable<TDetail> GetDetails(TEntity entity, CultureInfo cultureInfo = null);

        IQueryable<TDetail> GetDetails(TEntity entity, string cultureName, string defaultCultureName);

        TDetail CreateDetail(TEntity entity, string field, object value, string group, string prefix, string suffix, User owner, DateTime? dateTime = null);

        IEnumerable<TDetail> CreateDetails(TEntity entity, IDictionary<string, string> detailDictionary, User owner, DateTime? dateTime = null);

        IEnumerable<TDetail> CreateDetails(TEntity entity, IEnumerable<TDetail> details, User owner = null, DateTime? dateTime = null);

        void UpdateDetails(TEntity entity, Dictionary<string, string> detailsDictionary, User byUser);

        /// <summary>
        /// Update details of an entity
        /// </summary>
        /// <param name="entity">Entity to update</param>
        /// <param name="details">List of details to update</param>
        /// <param name="byUser">Update made by the user</param>
        /// <param name="deleteExcept">Delete all non-update fields</param>
        void UpdateDetails(TEntity entity, IEnumerable<TDetail> details, User byUser, bool deleteExcept = true);

        TEntity Add(TEntity entity, User user = null);

        void Delete(TEntity entity);

        string GenerateEntityName(string name, long? entityId = null);

        TEntity Update(TEntity entity);

        void SetContext(DbContext dbContext);
    }
}