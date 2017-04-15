using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;

namespace CoreIn.Commons.Form
{
    public class FieldInput
    {
        public FieldInput(string name)
        {
            Name = name;
        }

        public FieldInput(string name, object value) : this(name)
        {
            Value = value;
        }

        public string Name { get;}

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public object Value { get; set; }
    }
}
