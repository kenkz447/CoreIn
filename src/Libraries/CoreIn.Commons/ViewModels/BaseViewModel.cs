using Newtonsoft.Json;

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

        public void SetId(long id) => Id = id;
        public void SetThumbnail(string thumbnailUrl) => ThumbnailUrl = thumbnailUrl;

    }
}