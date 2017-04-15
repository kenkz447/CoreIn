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
    public enum FileTypes { Image, Music, Video, Document, Other}

    public static partial class MediaHelper
    {
        public static FileTypes CheckFileType(string FileName)
        {
            switch (Path.GetExtension(FileName))
            {
                case ".jpg":
                case ".png":
                    return FileTypes.Image;
                default:
                    return FileTypes.Other;
            }
        }
    }
}
