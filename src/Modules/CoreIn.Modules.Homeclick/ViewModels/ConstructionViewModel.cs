using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class ConstructionViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldLocalization]
        [FormFieldDisplay(Placeholder: "Construction title here...")]
        public override string Title { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Content", RenderType:(int)FieldRenderType.Editor)]
        public string Content { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail", Prompt: "Size (Width x Height): 720x540")]
        public ImageViewModel Thumbnail { get; set; }

        [FormFieldDisplay(Placeholder: "Status", Type: "number", Prompt: "0: Concept, 1: Under construction, 2: finish")]
        public string Status { get; set; }

        [FormFieldDisplay(Placeholder: "Client")]
        public string Client { get; set; }

        [FormFieldDisplay(Placeholder: "Date")]
        public string Date { get; set; }

        [FormFieldDisplay(Placeholder: "Area")]
        public string Area { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Covers", Prompt: "Pictures will display on top and bottom of article. All need the same ratio (16:9 recommended)")]
        public IEnumerable<AlbumImageViewModel> CoverPhotos { get; set; }
    }
}