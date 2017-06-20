using CoreIn.Models;
using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;

namespace CoreIn.Commons.ViewModels
{
    public class BaseEntityViewModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        private long? Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        private string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        private string ThumbnailUrl { get; set; }


        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public virtual string Title { get; set; }

        [JsonProperty]
        private Dictionary<long, IEnumerable<TaxonomyViewModel>> TaxonomyTypes { get; set; }

        public void SetId(long id) => Id = id;

        public long? GetId() => Id;

        public string GetName() => Name;

        public string SetName(string name) => Name = name;

        //cung cấp thêm detail nếu đc yêu cầu
        [JsonProperty]
        private Dictionary<string, object> MoreDetailts { get; set; }

        public void SetThumbnail(string thumbnailUrl) => ThumbnailUrl = thumbnailUrl;

        public void SetTaxonomyTypes(Dictionary<long, IEnumerable<TaxonomyViewModel>> taxonomyTypes) => TaxonomyTypes = taxonomyTypes;

        public void SetMoreDetail(string field, object value)
        {
            if (MoreDetailts == null)
                MoreDetailts = new Dictionary<string, object>();
            MoreDetailts.Add(field, value);
        }
    }
}