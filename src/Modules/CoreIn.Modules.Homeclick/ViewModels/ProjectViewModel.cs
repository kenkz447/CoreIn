using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class ProjectRoomCollectionViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Collection name")]
        public string CollectionName { get; set; }

        [FormFieldStatus((int)FieldStatus.ReadOnly)]
        [FormFieldDisplay(Title: "Layout data")]
        [FormFieldAction("Set layout", "SET_LAYOUT")]
        public string LayoutData { get; set; }
    }

    public class ProjectRoomViewModel
    {
        [Required]
        [FormFieldDisplay(Title: "Tower")]
        public string Tower { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Floor")]
        public string Floor { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Room name")]
        public string Room { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Room description", Type: "textarea")]
        public string RoomDescription { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Layout image")]
        public string LayoutImage { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Collections")]
        public IEnumerable<ProjectRoomCollectionViewModel> Collections { get; set; }
    }

    public class ProjectViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldDisplay(Title: "Project name here...")]
        public override string Title { get; set; }

        [FormFieldDisplay(Title: "Description", Type: "textarea")]
        public string Description { get; set; }

        [FormFieldDisplay(Title: "City")]
        public string City { get; set; }

        [FormFieldDisplay(Title: "County")]
        public string County { get; set; }

        [FormFieldDisplay(Title: "Address")]
        public string Address { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
        public override string Thumbnail { get; set; }

        [FormFieldDisplay(Title: "Rooms")]
        public IEnumerable<ProjectRoomViewModel> Rooms { get; set; }
    }
}