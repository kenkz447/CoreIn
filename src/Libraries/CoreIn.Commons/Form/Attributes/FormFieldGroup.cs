using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form.Attributes
{
    public class FormFieldGroup : Attribute
    {
        public string Group { get; set; }

        public FormFieldGroup()
        {

        }
    }
}