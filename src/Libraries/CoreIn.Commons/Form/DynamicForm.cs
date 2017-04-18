using Newtonsoft.Json;
using System.Collections.Generic;

namespace CoreIn.Commons.Form
{
    public class DynamicForm
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Meta { get; set; } = new List<FormField>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Details { get; set; } = new List<FormField>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<FormTaxonomyType> TaxonomyTypes { get; set; } = new List<FormTaxonomyType>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FormValues InitialValues { get; set; }
    }
}
