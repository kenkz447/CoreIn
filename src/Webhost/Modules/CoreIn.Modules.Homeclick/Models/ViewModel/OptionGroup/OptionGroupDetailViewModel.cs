using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.Models
{
    public class OptionDetailModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Option name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Option value")]
        public string Value { get; set; }
    }

    public class OptionGroupDetailViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Name")]
        public string Title { get; set; }

        [FormFieldDisplay(Title: "Options")]
        public IEnumerable<OptionDetailModel> Options { get; set; }
    }
}