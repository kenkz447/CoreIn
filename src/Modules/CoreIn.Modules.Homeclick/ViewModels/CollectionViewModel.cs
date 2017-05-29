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
        [FormFieldDisplay(Placeholder: "Product name")]
        public string ProductName { get;set;}

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        public string ProductThumbnail { get; set; }
    }

    public class CollectionViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldDisplay(Title: "Collection name")]
        public override string Title { get; set; }

        [FormFieldDisplay(Placeholder: "Description", RenderType: (int)FieldRenderType.Editor)]
        public string Description { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
        public ImageViewModel Thumbnail { get; set; }

        [FormFieldDisplay(Title: "Products")]
        public IEnumerable<CollectionProductViewModel> Products { get; set; }
    }
}
