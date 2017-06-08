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
        private string ThumbnailUrl { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public virtual string Title { get; set; }

        [JsonProperty]
        private Dictionary<long, IEnumerable<TaxonomyViewModel>> TaxonomyTypes { get; set; }

        public void SetId(long id) => Id = id;
        public long? GetId() => Id;

        public void SetThumbnail(string thumbnailUrl) => ThumbnailUrl = thumbnailUrl;

        public void SetTaxonomyTypes(Dictionary<long, IEnumerable<TaxonomyViewModel>> taxonomyTypes) => TaxonomyTypes = taxonomyTypes;
    }
}