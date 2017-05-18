using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.Models
{
    public class PostDetailsViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Name")]
        public string Title { get; set; }

        [FormFieldDisplay(Title: "Excerpt")]
        public string Excerpt { get; set; }

        [FormFieldDisplay(Title: "Description", Type: "textarea")]
        public string Description { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        public string Thumbnail { get; set; }
    }
}