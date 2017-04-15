﻿using System;
using System.Text.RegularExpressions;
using Unidecode.NET;

namespace CoreIn.Commons
{
    public static class StringUtility
    {
        public static string TrimSpacesBetweenString(this string str)
        {
            var options = RegexOptions.None;
            var regex = new Regex(@"[ ]{2,}", options);
            return regex.Replace(str, @" ");
        }

        public static string UnidecodeEntityNaname(string name)
        {
            var result = name.TrimSpacesBetweenString();
            result = result.Unidecode();
            result = result.Replace(' ', '-');
            result = result.ToLower();
            return result;
        }
           
    }
}