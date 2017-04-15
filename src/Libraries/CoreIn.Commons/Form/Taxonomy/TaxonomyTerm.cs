using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace CoreIn.Commons.Form
{
    public class TaxonomyTerm
    {
        public string Title { get; set; }
        public string Name { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> DetailDictionary { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<TaxonomyTerm> ChildrenTerms { get; set; }
    }
}
