using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.Models
{
    public class ConstructionPhotoViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Image")]
        [JsonProperty(PropertyName = "photoimage")]
        public string PhotoImage { get; set; }

        [FormFieldDisplay(Title: "Photo description")]
        [JsonProperty(PropertyName = "photodescription")]
        public string PhotoDescription { get; set; }
    }

    public class ConstructionDetailViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Name")]
        public string Title { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Type: "textarea",Title: "Content")]
        public string Content { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        public string Thumbnail { get; set; }

        [Required(ErrorMessage = "Need as least one photo.")]
        [FormFieldDisplay(Title: "Photos")]
        public IEnumerable<ConstructionPhotoViewModel> Photos { get; set; }
    }
}