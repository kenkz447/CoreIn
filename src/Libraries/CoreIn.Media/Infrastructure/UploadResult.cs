using System;
using System.Collections.Generic;
using System.Text;
using CoreIn.Commons;

namespace CoreIn.Media
{
    public sealed class FileEntityResult : BaseAjaxResult
    {
        public string FileName { get;}

        public FileEntityResult(JsonResultState resultState, string fileName, string message) : base(resultState, message)
        {
            FileName = fileName;
        }

        public FileEntityResult(JsonResultState resultState, string fileName, string message, object result) : base(resultState, message, result)
        {
            FileName = fileName;
        }
    }
}
