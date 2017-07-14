using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class ProjectRoomCollectionViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Collection Id")]
        public string CollectionId { get; set; }

        [FormFieldStatus((int)FieldStatus.ReadOnly)]
        [FormFieldDisplay(Title: "Layout data")]
        [FormFieldAction("Set layout", "SET_LAYOUT")]
        public string LayoutData { get; set; }
    }

    public class ProjectRoomViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Phòng")]
        public string Room { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Diện tích")]
        public string Area { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Tình trạng", Prompt: "Chưa hoàn thành: nhập 0, đã hoàn thành 1.")]
        public string Status { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Mô tả", Type:"textarea")]
        public string Description { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Layout")]
        public ImageViewModel LayoutImage { get; set; }

        [FormFieldDisplay(Title: "Collections")]
        public IEnumerable<ProjectRoomCollectionViewModel> Collections { get; set; }
    }

    public class ProjectFloorViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Tầng")]
        public string Floor { get; set; }

        [FormFieldDisplay(Title: "Rooms")]
        public IEnumerable<ProjectRoomViewModel> Rooms { get; set; }
    }

    public class ProjectTowerViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Tháp")]
        public string Tower { get; set; }

        [FormFieldDisplay(Title: "Floor")]
        public IEnumerable<ProjectFloorViewModel> Floors { get; set; }
    }

    public class ProjectViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldDisplay(Placeholder: "Project name here...")]
        public override string Title { get; set; }

        [FormFieldDisplay(Title: "Description", RenderType: (int)FieldRenderType.Editor)]
        public string Description { get; set; }

        [FormFieldDisplay(Title: "City")]
        public string City { get; set; }

        [FormFieldDisplay(Title: "Address")]
        public string Address { get; set; }

        [FormFieldDisplay(Title: "Map latitude", Prompt: "Vị trí trên google map")]
        public string MapLatitude { get; set; }

        [FormFieldDisplay(Title: "Map longitude", Prompt: "Vị trí trên google map")]
        public string MapLongitude { get; set; }

        [FormFieldDisplay(Title: "Diện tích")]
        public string Area { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
        public ImageViewModel Thumbnail { get; set; }

        [FormFieldDisplay(Title: "Towers")]
        public IEnumerable<ProjectTowerViewModel> Towers { get; set; }
    }
}