using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.Domain.Page.Form
{
    public class PageDetailViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Page title")]
        public string Title { get; set; }

        [FormFieldDisplay(Type: "textarea",Title: "Content")]
        public string Content { get; set; }
    }
}