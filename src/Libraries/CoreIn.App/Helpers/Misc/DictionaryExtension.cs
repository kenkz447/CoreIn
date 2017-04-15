using System;
using System.Collections.Generic;
using System.Text;

namespace System.Collections.Generic
{
    public static class DictionaryExtension
    {
        public static string GetValue(this Dictionary<string, string> dictionary, string key)
        {
            string result;

            if (dictionary.TryGetValue(key, out result))
                return result;

            return null;
        }
    }
}
