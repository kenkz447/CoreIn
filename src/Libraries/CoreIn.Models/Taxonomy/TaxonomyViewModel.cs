using Newtonsoft.Json;

namespace CoreIn.Models
{
    public class TaxonomyViewModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public long Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public long? ParentId { get; set; }
    }
}