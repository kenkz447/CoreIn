using CoreIn.Commons.Form.Attributes;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class SocialsViewModel
    {
        [FormFieldDisplay(Placeholder: "Facebook")]
        public string Facebook { get; set; }

        [FormFieldDisplay(Placeholder: "Twitter")]
        public string Twitter { get; set; }

        [FormFieldDisplay(Placeholder: "Instagram")]
        public string Instagram { get; set; }
    }
}
