using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.Models
{
    public class ProjectRoomCollectionViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Placeholder: "Collection name")]
        public string CollectionName { get; set; }

        [FormFieldStatus((int)FieldStatus.ReadOnly)]
        [FormFieldDisplay(Title: "Layout data")]
        [FormFieldAction("Set layout", "SET_LAYOUT")]
        public string LayoutData { get; set; }
    }

    public class ProjectRoomViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Tower")]
        public string Tower { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Floor")]
        public string Floor { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Room name")]
        public string Room { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Room description", Type: "textarea")]
        public string RoomDescription { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Layout image")]
        public string LayoutImage { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Collections")]
        public IEnumerable<ProjectRoomCollectionViewModel> Collections { get; set; }
    }

    public class ProjectDetailsViewModel
    {
        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(Title: "Project name")]
        public string Title { get; set; }

        [FormFieldDisplay(Title: "Description", Type: "textarea")]
        public string Description { get; set; }

        [Required(ErrorMessage = "This field cann't be empty")]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail image")]
        public string Thumbnail { get; set; }

        [FormFieldDisplay(Title: "Rooms")]
        public IEnumerable<ProjectRoomViewModel> Rooms { get; set; }
    }
}
