using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using Microsoft.AspNetCore.Mvc;

using CoreIn.Commons.ViewModels;

namespace CoreIn.Media
{
    [Bind("Url")]
    public class FileViewModel : BaseEntityViewModel
    {
        public string FileName { get; set; }

        [FormFieldGroup(Group = "0")]
        [FormFieldDisplay((int)FieldRenderType.Text, Title: "Url")]
        public string Url { get; set; }

        [FormFieldGroup(Group = "0")]
        [FormFieldDisplay((int)FieldRenderType.Text, Title: "Type")]
        public string Type { get; set; }

        public string Extension { get; set; }

        [FormFieldGroup(Group = "0")]
        [FormFieldDisplay((int)FieldRenderType.Text, Title: "Size")]
        public string Size { get; set; }
    }
}