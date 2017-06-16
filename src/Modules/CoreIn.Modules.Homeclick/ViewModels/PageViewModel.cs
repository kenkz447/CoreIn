using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class PageViewModel: BaseEntityViewModel
    {
        [Required]
        [FormFieldLocalization]
        [FormFieldDisplay(Placeholder: "Page title here...")]
        public override string Title { get; set; }

        [FormFieldLocalization]
        [FormFieldDisplay(RenderType:(int)FieldRenderType.Editor, Placeholder: "Write page content here...")]
        public string Content { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
        public ImageViewModel Thumbnail { get; set; }
    }
}