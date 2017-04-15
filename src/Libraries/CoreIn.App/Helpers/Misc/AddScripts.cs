using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CoreIn.App.Helpers
{
    public static partial class Helper
    {
        private const string _jSViewDataName = "RenderJavaScript";
        private const string _styleViewDataName = "RenderStyle";

        public static void AddJavaScript(this IHtmlHelper htmlHelper,
                                         string scriptURL)
        {
            List<string> scriptList = htmlHelper.ViewContext.HttpContext
              .Items[Helper._jSViewDataName] as List<string>;
            if (scriptList != null)
            {
                if (!scriptList.Contains(scriptURL))
                {
                    scriptList.Add(scriptURL);
                }
            }
            else
            {
                scriptList = new List<string>();
                scriptList.Add(scriptURL);
                htmlHelper.ViewContext.HttpContext
                  .Items.Add(Helper._jSViewDataName, scriptList);
            }
        }

        public static HtmlString RenderJavaScripts(this IHtmlHelper HtmlHelper)
        {
            StringBuilder result = new StringBuilder();

            List<string> scriptList = HtmlHelper.ViewContext.HttpContext
              .Items[Helper._jSViewDataName] as List<string>;
            if (scriptList != null)
            {
                foreach (string script in scriptList)
                {
                    result.AppendLine($"<script type=\"text/javascript\" src=\"{script}\"></script>");
                }
            }
            return new HtmlString(result.ToString());
        }

        public static void AddStyle(this IHtmlHelper htmlHelper, string styleURL)
        {
            List<string> styleList = htmlHelper.ViewContext.HttpContext
              .Items[Helper._styleViewDataName] as List<string>;

            if (styleList != null)
            {
                if (!styleList.Contains(styleURL))
                {
                    styleList.Add(styleURL);
                }
            }
            else
            {
                styleList = new List<string>();
                styleList.Add(styleURL);
                htmlHelper.ViewContext.HttpContext
                  .Items.Add(Helper._styleViewDataName, styleList);
            }
        }

        public static HtmlString RenderStyles(this IHtmlHelper htmlHelper)
        {
            StringBuilder result = new StringBuilder();

            List<string> styleList = htmlHelper.ViewContext.HttpContext
              .Items[Helper._styleViewDataName] as List<string>;

            if (styleList != null)
            {
                foreach (string script in styleList)
                {
                    result.AppendLine($"<link href=\"{script}\" rel=\"stylesheet\" type=\"text/css\"/>");
                }
            }

            return new HtmlString(result.ToString());
        }
    }
}
