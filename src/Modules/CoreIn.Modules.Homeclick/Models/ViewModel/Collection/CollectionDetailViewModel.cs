using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.Models.ViewModel.Collection
{
    public class CollectionProductViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Placeholder: "Product name")]
        [JsonProperty(PropertyName = "productname")]
        public string ProductName { get;set;}

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        [JsonProperty(PropertyName = "productthumbnail")]
        public string ProductThumbnail { get; set; }
    }

    public class CollectionDetailViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Collection name")]
        public string Title { get; set; }

        [FormFieldDisplay(Title: "Description", Type: "textarea")]
        public string Description { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        public string Thumbnail { get; set; }

        [FormFieldDisplay(Title: "Products")]
        public IEnumerable<CollectionProductViewModel> Products { get; set; }
    }
}
