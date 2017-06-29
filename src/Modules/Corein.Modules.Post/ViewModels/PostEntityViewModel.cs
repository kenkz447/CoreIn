using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using CoreIn.Modules.Homeclick.ViewModels;
using Newtonsoft.Json;
using System.Collections.Generic;
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

        [FormFieldDisplay(Title: "Content", RenderType: (int)FieldRenderType.Editor)]
        public string Content { get; set; }

        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        public ImageViewModel Thumbnail { get; set; }

        [FormFieldDisplay(Placeholder: "Writer")]
        public string Writer { get; set; }

        [FormFieldDisplay(Placeholder: "Facebook")]
        public string Facebook { get; set; }

        [FormFieldDisplay(Placeholder: "Twitter")]
        public string Twitter { get; set; }

        [FormFieldDisplay(Placeholder: "Instagram")]
        public string Instagram { get; set; }

        [FormFieldDisplay(Title: "Cover photos")]
        public IEnumerable<AlbumImageViewModel> CoverPhotos { get; set; }
    }
}