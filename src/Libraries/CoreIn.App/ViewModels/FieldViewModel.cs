using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.App.ViewModels
{
    public class FieldViewModel
    {
        public Dictionary<string, object> Input { get; set; }
        public object Validate { get; set; }
        public object Display { get; set; }

        public object GetRawValue()
        {
            var result = new
            {
                input = Input,
                validate = Validate,
                display = Display
            };
            return result;
        }
    }
}