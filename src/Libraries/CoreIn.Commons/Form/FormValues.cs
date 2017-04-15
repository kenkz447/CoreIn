using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form
{
    public class FormValues
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Meta { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Details { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Taxonomies { get; set; }
    }
}
