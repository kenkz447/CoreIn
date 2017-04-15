using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CoreIn.Commons.Form
{
    public class FormField
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FieldInput Input { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FieldValidate Validate { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FieldDisplay Display { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(StringEnumConverter))]
        public FieldStatus Status { get; set; }
    }
}
