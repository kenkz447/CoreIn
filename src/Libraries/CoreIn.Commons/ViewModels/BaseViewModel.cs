using Newtonsoft.Json;

namespace CoreIn.Commons.ViewModels
{
    public class BaseEntityViewModel
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public long Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public virtual string Thumbnail { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public virtual string Title { get; set; }
    }
}