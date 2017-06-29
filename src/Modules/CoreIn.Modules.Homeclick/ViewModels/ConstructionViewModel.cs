using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class ConstructionPhotoViewModel
    {
        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Image")]
        public ImageViewModel PhotoImage { get; set; }

        [FormFieldDisplay(Title: "Html class")]
        public string HtmlClasss { get; set; }
    }

    public class ConstructionViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldLocalization]
        [FormFieldDisplay(Placeholder: "Construction title here...")]
        public override string Title { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Content", RenderType:(int)FieldRenderType.Editor)]
        public string Content { get; set; }

        [FormFieldDisplay(Placeholder: "Area")]
        public string Area { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
        public ImageViewModel Thumbnail { get; set; }

        [FormFieldDisplay(Placeholder: "Client")]
        public string Client { get; set; }

        [FormFieldDisplay(Placeholder: "Facebook")]
        public string Facebook { get; set; }

        [FormFieldDisplay(Placeholder: "Twitter")]
        public string Twitter { get; set; }

        [FormFieldDisplay(Placeholder: "Instagram")]
        public string Instagram { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Covers")]
        public IEnumerable<AlbumImageViewModel> CoverPhotos { get; set; }

        [FormFieldDisplay(Title: "Photos")]
        public IEnumerable<ConstructionPhotoViewModel> Photos { get; set; }
    }
}