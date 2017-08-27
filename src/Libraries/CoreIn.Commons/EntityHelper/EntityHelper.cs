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

        /// <summary>
        /// Kiểm tra xem trong table đã có entity nào với 'name' như vậy hay chưa
        /// </summary>
        /// <param name="name">Name cần kiểm tra</param>
        /// <param name="entityId">Id của entity, tham số được truyền vào tức là đang kiểm tra tên cho 1 entity cụ thể</param>
        /// <returns>
        /// Trả về false khi tìm thấy entity trùng hoặc không tìm thấy entity nào
        /// Trả về true khi tìm thấy bất kỳ entity nào khác với entity hiện tại
        /// </returns>
        private bool CheckEntityNameExits(string name, long? entityId = null)
        {
            var entityWasFound = _entityRepository.GetBy(o => o.Name == name);

            if (entityWasFound != null)
            {
                if (entityWasFound.Id != entityId)
                    return false;
                else
                    return true;
            }

            return false;
        }
            

        private string TryGenerateEntityName(string preName, int tryTimes = 1)
        {
            var newName = $"{preName}-{tryTimes}";
            if (CheckEntityNameExits(newName))
                return TryGenerateEntityName(preName, tryTimes + 1);

            return newName;
        }

        public string GenerateEntityName(string name, long? entityId = null)
        {
            var entityName = StringUtility.UnidecodeEntityName(name);
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

        public IEnumerable<TDetail> GetDetails(TEntity entity, CultureInfo cultureInfo = null)
            => GetDetails(entity, cultureInfo?.Name);

        public IEnumerable<TDetail> GetDetails(TEntity entity, string cultureName, string defaultCultureName = null)
        {
            var details = _detailRepository.Query(o => o.EntityId == entity.Id);

            if (cultureName == null)
                return details;

            var hasLanguage = details.Where(o => o.Language != null && o.Prefix == null).OrderBy(o => o.Language == cultureName);
            var selectedFields = new List<string>();
            foreach (var item in hasLanguage)
            {
                if (selectedFields.Contains(item.Field))
                    continue;

                selectedFields.Add(item.Field);
            }

            var result = details.Except(hasLanguage).ToList();
            foreach (var item in hasLanguage.Where(o => o.Language == cultureName))
            {
                if (item.Value != null)
                    result.Add(item);
            }

            foreach (var field in selectedFields)
            {
                if (!result.Select(o => o.Field).Contains(field))
                {
                    var fieldDetail = hasLanguage.FirstOrDefault(o => o.Language == defaultCultureName && o.Field == field);

                    if (fieldDetail == null)
                        continue;

                    result.Add(fieldDetail);
                }
            }

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
                    if (currentDetail.Field == detail.Field
                        && currentDetail.TempId == detail.TempId
                        && currentDetail.Group == detail.Group
                        && currentDetail.Suffix == detail.Suffix
                        && currentDetail.Prefix == detail.Prefix
                        )
                    {
                        if (currentDetail.Language != null && currentDetail.Language != detail.Language)
                        {
                            updatedDetails.Add(currentDetail);
                            if(currentEntityDetails.FirstOrDefault(o => o.Field == detail.Field && o.Language == detail.Language) == null)
                            {
                                CreateDetail(entity, detail, byUser);
                            }
                        }
                        else
                        {
                            currentDetail.Value = detail.Value;

                            if (detail.Language != null)
                                currentDetail.Language = detail.Language;

                            currentDetail.Modified = DateTime.UtcNow;
                            currentDetail.ModifiedById = byUser?.Id;

                            var updatedDetail = _detailRepository.Update(currentDetail);
                            updatedDetails.Add(updatedDetail);
                        }
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
                    _detailRepository.SetState(item, EntityState.Deleted);
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