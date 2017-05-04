using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Collections.Generic;

namespace CoreIn.Commons.Form
{
    public class FieldAction
    {
        public FieldAction(string title, string command)
        {
            this.Title = title;
            this.Command = command;
        }

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get;}

        [JsonProperty(NullValueHandling = NullValueHandling.Ignore)]
        public string Command { get;}
    }
}
