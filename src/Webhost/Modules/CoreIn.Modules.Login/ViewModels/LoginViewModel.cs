using CoreIn.App.Attributes;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Login.ViewModels
{
    public class LoginViewModel
    {
        [Display(Name = "Email", ShortName = "<i class=\"icon-user\"></i>", Description = "Your email")]
        [CustomRequired]
        [DataType(DataType.EmailAddress)]
        [ValidateType(DataType.EmailAddress), RenderAs(RenderType.InputGroup)]
        public string Email { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Password", ShortName = "<i class=\"icon-lock\"></i>", Description = "Password")]
        [CustomRequired, CustomRequiredNumber, CustomRequiredLower, CustomRequiredUpper, CustomRequiredSpecialChar, CustomStringLength(MaximumLength: 32, MinimumLength = 6), RenderAs(RenderType.InputGroup)]
        public string Password { get; set; }

        [Display(Name = "Remember", Description = "Remember me")]
        public bool RememberMe { get; set; }
    }
}
