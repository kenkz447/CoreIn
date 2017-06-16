using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class OptionDetailModel
    {
        [Required]
        [FormFieldDisplay(Title: "Option name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Option value", Type: "textarea")]
        [FormFieldLocalization]
        public string Value { get; set; }
    }

    public class OptionGroupViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldDisplay( Placeholder: "Option group name here...")]
        public override string Title { get; set; }

        [FormFieldDisplay(Title: "Options")]
        public IEnumerable<OptionDetailModel> Options { get; set; }
    }
}