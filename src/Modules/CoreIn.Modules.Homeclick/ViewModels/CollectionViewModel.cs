using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class CollectionPhotoViewModel
    {
        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Image")]
        public ImageViewModel PhotoImage { get; set; }

        [FormFieldDisplay(Title: "Html class")]
        public string HtmlClasss { get; set; }
    }

    public class CollectionProductViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Title")]
        public string Title { get;set;}

        [Required]
        [FormFieldDisplay(Placeholder: "Code")]
        public string Code { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Price")]
        public string Price { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Size")]
        public string Size { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Quantity", Type:"number")]
        public string Quantity { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Description", Type: "textarea")]
        public string Description { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
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
        [FormFieldDisplay(Title: "Covers")]
        public IEnumerable<AlbumImageViewModel> CoverPhotos { get; set; }

        [FormFieldDisplay(Title: "Products")]
        public IEnumerable<CollectionProductViewModel> Products { get; set; }
    }
}
