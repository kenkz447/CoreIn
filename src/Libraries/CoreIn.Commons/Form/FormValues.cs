using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CoreIn.Commons.Form
{
    public class FormValues
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Meta { get; set; } = new Dictionary<string, string>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Details { get; set; } = new Dictionary<string, string>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<long, Dictionary<long, bool>> TaxonomyTypes { get; set; }

        public string GetMetaValue(string metaKey)
        {
            if (Meta.ContainsKey(metaKey))
                return Meta[metaKey];
            return null;
        }

        public long? GetMetaValueAsLong(string metaKey)
        {
            if (Meta.ContainsKey(metaKey) && Meta[metaKey] != null)
                return long.Parse(Meta[metaKey]);
            return null;
        }
    }
}