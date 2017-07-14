using System;
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

        public static string UnidecodeEntityName(string name)
        {
            var result = name.TrimSpacesBetweenString();
            result = result.Unidecode();
            result = result.Replace(' ', '-');
            result = result.ToLower();
            return result;
        }

        public static string FirstCharacterToLower(this string str)
        {
            if (String.IsNullOrEmpty(str) || Char.IsLower(str, 0))
                return str;

            return Char.ToLowerInvariant(str[0]) + str.Substring(1);
        }
    }

    public static class NumberUtility
    {
        public static readonly string[] SizeSuffixes = { "bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" };
        public static string SizeSuffix(this long value, int decimalPlaces = 0)
        {
            if (value < 0)
            {
                throw new ArgumentException("Bytes should not be negative", "value");
            }
            var mag = (int)Math.Max(0, Math.Log(value, 1024));
            var adjustedSize = Math.Round(value / Math.Pow(1024, mag), decimalPlaces);
            return String.Format("{0} {1}", adjustedSize, SizeSuffixes[mag]);
        }
    }
}
