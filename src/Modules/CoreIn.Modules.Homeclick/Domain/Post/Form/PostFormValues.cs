using CoreIn.Commons.Form;
using CoreIn.Modules.Homeclick.Models;

namespace CoreIn.Modules.Homeclick.Domain.Post.Form
{
    public class PostFormValues : FormValues
    {
        public new PostDetailsViewModel Details { get; set; }
    }
}