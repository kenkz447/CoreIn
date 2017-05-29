using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using Microsoft.AspNetCore.Mvc;

namespace CoreIn.Media
{
    [Bind("Url", "Title", "Description")]
    public class ImageViewModel : FileViewModel
    {
        public string UrlThumb { get; set; }

        [FormFieldGroup(Group = "0")]
        [FormFieldDisplay((int)FieldRenderType.Text, Title: "Dimension")]
        public string Dimension { get; set; }

        [FormFieldGroup(Group = "1")]
        [FormFieldDisplay(Placeholder: "Title (pop-up when mouseover)")]
        public override string Title { get; set; }

        [FormFieldGroup(Group = "1")]
        [FormFieldDisplay(Placeholder: "Description (alt)")]
        public string Description { get; set; }
    }
}