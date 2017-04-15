using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using ImageSharp;
using System.IO;
using ImageSharp.Processing;

namespace CoreIn.App.Helpers
{
    public static partial class MediaHelper
    {
        public static void CropThumbnail(string pathToImage, int thumbSize, string savePath)
        {
            using (Image image = new Image(pathToImage))
            {
                image.Resize(new ResizeOptions { Mode = ResizeMode.Crop, Size = new Size(thumbSize, thumbSize) });
                image.Save(savePath);
            }
        }
    }
}
