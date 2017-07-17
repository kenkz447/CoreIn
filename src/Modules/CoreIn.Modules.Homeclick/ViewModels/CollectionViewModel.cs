using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class CollectionProductViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Title", Prompt:"Product's name, example: 'Chiển Console'")]
        public string Title { get;set;}

        [Required]
        [FormFieldDisplay(Placeholder: "Code", Prompt: "Code of products, example: 'C-C02'")]
        public string Code { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Price", Prompt: "In Vietnamese format, example: 4.500.000")]
        public string Price { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Size", Prompt: "Example: W1500 D820 H520")]
        public string Size { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Quantity", Type:"number", Prompt: "Quantity of product in current set")]
        public string Quantity { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Description", Type: "textarea", Prompt: "A short text describing this product")]
        public string Description { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail", Prompt: "Size (Width x Height): 720x540")]
        public ImageViewModel Thumbnail { get; set; }
    }

    public class CollectionViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldDisplay(Title: "Collection name")]
        public override string Title { get; set; }

        [FormFieldDisplay(Placeholder: "Content", RenderType: (int)FieldRenderType.Editor)]
        public string Content { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
        public ImageViewModel Thumbnail { get; set; }

        [FormFieldDisplay(Placeholder: "Writer")]
        public string Writer { get; set; }

        [FormFieldDisplay(Placeholder: "Facebook")]
        public string Facebook { get; set; }

        [FormFieldDisplay(Placeholder: "Twitter")]
        public string Twitter { get; set; }

        [FormFieldDisplay(Placeholder: "Instagram")]
        public string Instagram { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Covers", Prompt: "Pictures will display on top and bottom of article. All need the same ratio (16:9 recommended)")]
        public IEnumerable<AlbumImageViewModel> CoverPhotos { get; set; }

        [FormFieldDisplay(Title: "Products")]
        public IEnumerable<CollectionProductViewModel> Products { get; set; }
    }
}
