using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace CoreIn.Commons.Form
{
    public class FieldValidate
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Type { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Compare { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? MinLength { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public int? MaxLength { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, object> Required { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? ContainLower { get; set; }
        
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? ContainUpper { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? ContainSpecial { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public bool? ContainNumber { get; set; }

        public Dictionary<string, Dictionary<string, object>> ToDictionary()
            => new Dictionary<string, Dictionary<string, object>>
            {
                { "require", new Dictionary<string, object> { { "value", Required.ContainsKey("value") ? Required["value"] : null }, { "error", Required.ContainsKey("error") ? Required["error"] : null } } }
            };
    }
}
