using System;
using System.Collections.Generic;
using System.Linq;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CoreIn.Commons.EntityHelper
{
    public class EntityHelper<TEntity, TDetail> : IEntityHelper<TEntity, TDetail> 
        where TEntity : BaseEntity, new()
        where TDetail : BaseEntityDetail, IEntityWithTypedId<long>, new()
    {
        private readonly IRepository<TEntity> _entityRepository;
        private readonly IRepository<TDetail> _detailRepository;

        public EntityHelper(IRepository<TEntity> entityRepository, IRepository<TDetail> detailRepository)
        {
            _entityRepository = entityRepository;
            _detailRepository = detailRepository;
        }

        private bool CheckEntityNameExits(string name)
            => _entityRepository.GetBy(o => o.Name == name) != null;

        private string TryGenerateEntityName(string oldName, int tryTimes = 1)
        {
            var newName = $"{oldName}-{tryTimes}";
            if (CheckEntityNameExits(newName))
                return TryGenerateEntityName(oldName, tryTimes + 1);

            return newName;
        }

        public string GenerateEntityName(string name)
        {
            var entityName = StringUtility.UnidecodeEntityNaname(name);
            if (CheckEntityNameExits(entityName))
                entityName = TryGenerateEntityName(entityName);

            return entityName;
        }

        private TEntity CreateEntity(long? entityTypeId, long? parentEntityId, string name, long ownerId, DateTime? created = null)
        {
            var entity = new TEntity()
            {
                Name = name,
                ParentId = parentEntityId,
                OwnerId = ownerId,
                Created = created ?? DateTime.UtcNow,
                EntityTypeId = entityTypeId
            };
            _entityRepository.Add(entity);
            return entity;
        }

        public TEntity CreateEntity(string name, User owner, DateTime? created = null)
            => CreateEntity(null, null, name, owner.Id);

        public TEntity CreateEntity(EntityType entityType, string name, User owner, DateTime? created = null)
            => CreateEntity(entityType.Id, null, name, owner.Id);

        public TEntity CreateEntity(TEntity parentEntity, string name, User owner, DateTime? created = null)
            => CreateEntity(null, parentEntity.Id, name, owner.Id);

        public TEntity CreateEntity(EntityType entityType, TEntity parentEntity, string name, User owner, DateTime? created = null)
            => CreateEntity(entityType.Id, parentEntity.Id, name, owner.Id);

        public TEntity Entity(string name)
            => _entityRepository.GetBy(o => o.Name == name);

        public TEntity Entity(long id)
            => _entityRepository.GetById(id);

        public IQueryable<TEntity> GetChildrenEntities(TEntity parentEntity)
            => _entityRepository.Query(e => e.ParentId == parentEntity.Id);

        public TDetail CreateDetail(TEntity enitity, string field, object value, string group, string prefix, string suffix, User owner, DateTime? dateTime = null)
        {
            var detail = new TDetail()
            {
                Group = group,
                Prefix = prefix,
                Suffix = suffix,
                Field = field,
                EntityId = enitity.Id,
                Value = value.ToString(),
                ModifiedById = owner?.Id,
                Modified = dateTime ?? DateTime.UtcNow
            };

            _detailRepository.Add(detail);
            return detail;
        }

        private TDetail CreateDetail(TEntity entity, TDetail detail, User owner = null)
        {
            detail.EntityId = entity.Id;
            detail.Modified = DateTime.UtcNow;
            detail.ModifiedById = owner?.Id;

            _detailRepository.Add(detail);
            return detail;
        }

        public IEnumerable<TDetail> CreateDetails(TEntity entity, IDictionary<string, string> detailDictionary, User owner, DateTime? dateTime = null)
        {
            var result = new List<TDetail>();
            foreach (var kv in detailDictionary)
            {
                if (kv.Value == null)
                    continue;
                result.Add(CreateDetail(entity, kv.Key.FirstCharacterToLower(), kv.Value, null, null, null, owner, dateTime));
            }
            return result;
        }

        public IEnumerable<TDetail> CreateDetails(TEntity entity, IEnumerable<TDetail> details, User owner = null, DateTime? dateTime = null)
        {
            var result = new List<TDetail>();
            foreach (var detail in details)
            {
                CreateDetail(entity, detail, owner);
            }
            return result;
        }

        public IQueryable<TDetail> GetDetails(TEntity entity, CultureInfo cultureInfo = null)
        {
            var result = _detailRepository.Query(o => o.EntityId == entity.Id);
            if (cultureInfo != null)
                result = result.Where(o => o.Language == cultureInfo.Name || o.Language == null);
            return result;
        }

        public IQueryable<TDetail> GetDetails(TEntity entity, string cultureName)
        {
            var result = _detailRepository.Query(o => o.EntityId == entity.Id);
            result = result.Where(o => o.Language == cultureName || o.Language == null);
            return result;
        }


        public TDetail GetDetail(TEntity entity, string field)
            => GetDetails(entity).FirstOrDefault(o => o.Field == field);

        public void UpdateDetails(TEntity entity, Dictionary<string, string> detailsDictionary, User byUser)
        {
            var details = GetDetails(entity);
            foreach (var kv in detailsDictionary)
            {
                var detailPresent = false;

                foreach (var detail in details)
                {
                    if (detail.Field == kv.Key)
                    {
                        detail.Value = kv.Value;
                        detail.ModifiedById = byUser?.Id;
                        detailPresent = true;
                        break;
                    }
                }
                if (!detailPresent && kv.Value != null)
                {
                    CreateDetail(entity, kv.Key, kv.Value, null, null, null, byUser);
                }
            }
        }

        public void UpdateDetails(TEntity entity, IEnumerable<TDetail> details, User byUser, bool deleteExcept = true)
        {
            var currentEntityDetails = GetDetails(entity).ToList();
            var updatedDetails = new List<TDetail>();
            
            foreach (var detail in details)
            {
                var detailPresent = false;

                foreach (var currentDetail in currentEntityDetails)
                 {
                    if (currentDetail.Field == detail.Field && currentDetail.Language != detail.Language)
                        updatedDetails.Add(currentDetail);
                    else if (currentDetail.Field == detail.Field 
                        && currentDetail.Language == detail.Language
                        && currentDetail.Group == detail.Group
                        && currentDetail.Suffix == detail.Suffix
                        && currentDetail.Prefix == detail.Prefix
                        )
                    {
                        if (currentDetail.Value != detail.Value)
                        {
                            currentDetail.Value = detail.Value;
                            currentDetail.Modified = DateTime.UtcNow;
                            currentDetail.ModifiedById = byUser?.Id;
                        }

                        updatedDetails.Add(_detailRepository.Update(currentDetail));

                        detailPresent = true;
                    }
                }
                if (!detailPresent && detail.Value != null)
                    CreateDetail(entity, detail, byUser);
            }
            if (deleteExcept)
            {
                var deletes = currentEntityDetails.Except(updatedDetails);
                foreach (var item in deletes)
                {
                    if (true)
                    {

                    }
                    _detailRepository.SetState(item, EntityState.Deleted);
                }
            }

        }

        public TEntity Add(TEntity entity, User user = null)
        {
            entity.OwnerId = user?.Id;
            entity.Created = DateTime.UtcNow;

            _entityRepository.Add(entity);
            return entity;
        }

        public IQueryable<TEntity> Entities()
            => _entityRepository.Query();

        public void Delete(TEntity entity)
        {
            var children = _entityRepository.Query(o => o.ParentId == entity.Id).ToList();
            children.ForEach(child => child.ParentId = null);

            _entityRepository.Delete(entity);
        }

        public TEntity Update(TEntity entity)
           => _entityRepository.Update(entity);

        public void SetContext(DbContext dbContext)
        {
            _entityRepository.SetContext(dbContext);
            _detailRepository.SetContext(dbContext);
        }
    }
}