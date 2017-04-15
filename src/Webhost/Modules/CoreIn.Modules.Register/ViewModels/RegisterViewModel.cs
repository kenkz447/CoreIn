using CoreIn.App.Attributes;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Register.ViewModels
{
    public class RegisterViewModel
    {
        [CustomRequired, ValidateType(DataType.EmailAddress), RenderAs(RenderType.InputGroup)]
        [EmailAddress]
        [Display(Name = "Email", ShortName = "<i class=\"icon-user\"></i>")]
        public string Email { get; set; }

        [CustomRequired, CustomRequiredNumber, CustomRequiredLower, CustomRequiredUpper, CustomRequiredSpecialChar, CustomStringLength(MaximumLength: 32, MinimumLength = 6), RenderAs(RenderType.InputGroup)]
        [DataType(DataType.Password)]
        [Display(Name = "Password", ShortName = "<i class=\"icon-lock\"></i>", Prompt = "Password needs at least one lowercase, one uppercase letter, one number and one special character.")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Confirm Password", ShortName = "<i class=\"icon-lock\"></i>", Description = "Password again")]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        [RenderAs(RenderType.InputGroup)]
        public string ConfirmPassword { get; set; }
    }
}