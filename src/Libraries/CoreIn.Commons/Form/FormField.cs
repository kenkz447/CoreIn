using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;

namespace CoreIn.Commons.Form
{
    public class FormField
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FieldInput Input { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FieldValidate FieldValidate { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FieldDisplay Display { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> ChildFields { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FieldAction> Actions { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        [JsonConverter(typeof(StringEnumConverter))]
        public FieldStatus Status { get; set; }
    }
}
