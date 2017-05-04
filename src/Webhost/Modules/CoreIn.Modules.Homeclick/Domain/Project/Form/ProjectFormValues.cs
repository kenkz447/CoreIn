using CoreIn.Commons.Form;
using CoreIn.Modules.Homeclick.Models;
namespace CoreIn.Modules.Homeclick.Domain.Project.Form
{
    public class ProjectFormValues: FormValues
    {
        public new ProjectDetailsViewModel Details { get; set; }
    }
}