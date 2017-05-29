using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Post.ViewModels
{
    public class PostEntityViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldDisplay(Title: "Name")]
        public override string Title { get; set; }

        [FormFieldDisplay(Title: "Excerpt")]
        public string Excerpt { get; set; }

        [FormFieldDisplay(Title: "Description", Type: "textarea")]
        public string Description { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        public ImageViewModel Thumbnail { get; set; }
    }
}