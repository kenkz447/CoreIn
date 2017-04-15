using Microsoft.AspNetCore.Razor.TagHelpers;

namespace CoreIn.Commons.TagHelper
{
    class DynamicTagHelper : Microsoft.AspNetCore.Razor.TagHelpers.TagHelper
    {
        [HtmlAttributeName("tag-name")]
        public string TagName { get; set; }

        public override void Process(TagHelperContext context, TagHelperOutput output)
        {
            output.TagName = TagName;
            base.Process(context, output);
        }
    }
}