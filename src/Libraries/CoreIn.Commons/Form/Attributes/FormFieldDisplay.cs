using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form.Attributes
{
    public class FormFieldDisplayAttribute : Attribute
    {
        public FieldDisplay FieldDisplay { get; }

        public FormFieldDisplayAttribute(int RenderType = 0, string Type = null, string Title = null, string DisplayName = null, string Placeholder = null, string Prompt = null)
        {
            this.FieldDisplay = new FieldDisplay()
            {
                RenderType = (FieldRenderType)RenderType,
                Type = Type,
                Title = Title,
                DisplayName = DisplayName,
                Placeholder = Placeholder,
                Prompt = Prompt
            };
        }
    }
}
