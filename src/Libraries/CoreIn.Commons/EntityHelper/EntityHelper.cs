using System;
using System.Collections.Generic;
using System.Linq;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Models.Infrastructure;

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
            _entityRepository.AddAndSave(entity);
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

        public TDetail CreateDetail(TEntity enitity, string field, object value, User owner, DateTime? dateTime = null)
        {
            var detail = new TDetail()
            {
                Field = field,
                EntityId = enitity.Id,
                Value = value.ToString(),
                ModifiedById = owner?.Id,
                Modified = dateTime ?? DateTime.UtcNow
            };

            _detailRepository.AddAndSave(detail);
            return detail;
        }

        public IEnumerable<TDetail> CreateDetails(TEntity enitity, Dictionary<string, string> detailDictionary, User owner, DateTime? dateTime = null)
        {
            var result = new List<TDetail>();
            foreach (var kv in detailDictionary)
            {
                if (kv.Value == null)
                    continue;
                result.Add(CreateDetail(enitity, kv.Key, kv.Value, owner, dateTime));
            }
            return result;
        }

        public IQueryable<TDetail> Details(TEntity entity)
            => _detailRepository.Query(o => o.EntityId == entity.Id);

        public TDetail Detail(TEntity entity, string field)
            => Details(entity).FirstOrDefault(o => o.Field == field);

        public int UpdateDetails(TEntity entity, Dictionary<string, string> detailsDictionary, User byUser)
        {
            var details = Details(entity);
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
                    CreateDetail(entity, kv.Key, kv.Value, byUser);
                }
            }

            return _detailRepository.SaveChange();
        }

        public int Add(TEntity entity)
            => _entityRepository.AddAndSave(entity); 

        public IQueryable<TEntity> Entities()
            => _entityRepository.Query();

        public int Delete(TEntity entity)
            => _entityRepository.Delete(entity);

        public TEntity Update(TEntity entity)
           => _entityRepository.UpdateAndSave(entity);
    }
}