﻿using CoreIn.Commons.Form;
using CoreIn.Commons.Form.Attributes;
using CoreIn.Commons.ViewModels;
using CoreIn.Media;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Homeclick.ViewModels
{
    public class ConstructionPhotoViewModel
    {
        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Image")]
        public ImageViewModel PhotoImage { get; set; }

        [FormFieldDisplay(Title: "Photo description")]
        public string PhotoDescription { get; set; }
    }

    public class ConstructionViewModel : BaseEntityViewModel
    {
        [Required]
        [FormFieldLocalization]
        [FormFieldDisplay(Placeholder: "Construction title here...")]
        public override string Title { get; set; }

        [Required]
        [FormFieldDisplay(Placeholder: "Content", RenderType:(int)FieldRenderType.Editor)]
        public string Content { get; set; }

        [Required]
        [FormFieldDisplay(RenderType: (int)FieldRenderType.Image, Title: "Thumbnail")]
        public ImageViewModel Thumbnail { get; set; }

        [Required]
        [FormFieldDisplay(Title: "Photos")]
        public IEnumerable<ConstructionPhotoViewModel> Photos { get; set; }
    }
}