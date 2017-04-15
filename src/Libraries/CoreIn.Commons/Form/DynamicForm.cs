using Newtonsoft.Json;
using System.Collections.Generic;

namespace CoreIn.Commons.Form
{
    public class DynamicForm
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Meta { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Details { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormTaxonomy> Taxonomies { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FormValues InitialValues { get; set; }
    }
}
