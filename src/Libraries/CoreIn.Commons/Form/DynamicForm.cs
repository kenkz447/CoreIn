using CoreIn.Commons.Form.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Reflection;

namespace CoreIn.Commons.Form
{
    public class DynamicForm
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Languages { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string DefaultLanguage { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Meta { get; set; } = new List<FormField>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Details { get; set; } = new List<FormField>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<FormTaxonomyType> TaxonomyTypes { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public FormValues InitialValues { get; set; }
    }

    public class DynamicForm<TFormValue>
    {
        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public Dictionary<string, string> Languages { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string DefaultLanguage { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Meta { get; set; } = new List<FormField>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public List<FormField> Details { get; set; } = new List<FormField>();

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public IEnumerable<FormTaxonomyType> TaxonomyTypes { get; set; }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public TFormValue InitialValues { get; set; }
    }
}
