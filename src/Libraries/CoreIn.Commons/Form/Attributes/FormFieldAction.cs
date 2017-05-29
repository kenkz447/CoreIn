using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form.Attributes
{
    public class FormFieldActionAttribute : Attribute
    {
        public FieldAction FieldAction{ get; }

        public FormFieldActionAttribute(string Title, string Command)
        {
            this.FieldAction = new FieldAction(Title, Command);
        }
    }
}
