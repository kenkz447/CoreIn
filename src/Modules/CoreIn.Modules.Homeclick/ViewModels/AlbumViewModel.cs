using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class AlbumImageViewModel
    {
        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Image")]
        public ImageViewModel Image { get; set; }
    }

    public class AlbumViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Album title here...")]
        public override string Title { get; set; }

        [FormFieldDisplay(Placeholder: "Album description", RenderType: (int)FieldRenderType.Editor)]
        public string Description { get; set; }

        [FormFieldDisplay(Title: "Images")]
        public IEnumerable<AlbumImageViewModel> Images { get; set; }
    }
}