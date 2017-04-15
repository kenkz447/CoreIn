using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons
{
    public class BaseAjaxResult
    {
        public JsonResultState ResultState { get;}
        public string Message { get;}
        public object Result { get; }

        public BaseAjaxResult(JsonResultState resultState, string message)
        {
            ResultState = resultState;
            Message = message;
        }

        public BaseAjaxResult(JsonResultState resultState, string message, object result) : this(resultState, message)
        {
            Result = result;
        }
    }
}
