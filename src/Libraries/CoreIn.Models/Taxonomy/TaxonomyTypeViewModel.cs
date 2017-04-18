using Newtonsoft.Json;
using System.Collections.Generic;

namespace CoreIn.Models
{
    public class TaxonomyTypeViewModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public long Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string EntityTypeGroup { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string EntityType { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<TaxonomyViewModel> Taxonomies { get; set; }
    }
}