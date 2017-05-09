using Newtonsoft.Json;

namespace CoreIn.Modules.Homeclick.Models
{
    public class BaseViewModel
    {
        public long Id { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Thumbnail { get; set; }

        public string Title { get; set; }
    }
}