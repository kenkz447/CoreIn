using Microsoft.AspNetCore.Mvc.Razor;
using System.Collections.Generic;
using System.Linq;

namespace CoreIn.Modular.Infrastructure
{
    public class ModuleViewLocationExpander : IViewLocationExpander
    {
        private const string MODULE = "module";
        private const string COMPONENT = "component";

        public IEnumerable<string> ExpandViewLocations(ViewLocationExpanderContext context, IEnumerable<string> viewLocations)
        {
            if (context.Values.ContainsKey(MODULE))
            {
                var module = context.Values[MODULE];
                var moduleViewLocations = new List<string>();

                if (context.Values.ContainsKey("component"))
                {
                    var component = context.Values[COMPONENT];
                    moduleViewLocations.Add($"/Modules/{module}/Views/Shared/Components/{component}/default.cshtml");
                    moduleViewLocations.Add($"/Views/Shared/Components/{component}/default.cshtml");
                }
                // !!! Parent path "../" NOT working.
                else if (!string.IsNullOrWhiteSpace(module))
                {
                    moduleViewLocations.Add("../{0}.cshtml");
                    if (module.Contains("Themes"))
                        moduleViewLocations.AddRange(new string[] {
                       $"../Themes/{module}" + "/Views/{1}/{0}.cshtml",
                       $"../Themes/{module}" + "/Views/Shared/{0}.cshtml",
                    });
                    else
                    {
                        if (module.Contains("Modules"))
                            moduleViewLocations.AddRange(new string[] {
                           $"../Modules/{module}" + "/Views/{1}/{0}.cshtml",
                           $"../Modules/{ module}" + "/Views/Shared/{0}.cshtml",
                        });

                        moduleViewLocations.AddRange(new string[] {
                           "/Views/{1}/{0}.cshtml",
                           "/Views/Shared/{0}.cshtml"
                        });
                    }

                }

                viewLocations = moduleViewLocations.Concat(viewLocations);
            }
            return viewLocations;
        }

        public void PopulateValues(ViewLocationExpanderContext context)
        {
            var viewName = context.ViewName;
            var moduleName = default(string);

            //if is a view component request:
            if (viewName.Contains("Components"))
            {
                var nameCollection = viewName.Split('/');
                //if request form Webhost;
                if (nameCollection.Length == 3)
                    return;

                var componentName = nameCollection[2];
                moduleName = nameCollection[1].Replace('_','.');

                context.Values[MODULE] = moduleName;
                context.Values[COMPONENT] = componentName;
                return;
            }

            var actionFullName = context.ActionContext.ActionDescriptor.DisplayName;
            moduleName = string.Empty;
            foreach (var str in actionFullName.Split('.'))
            {
                if (str == "Controllers")
                    break;
                if (moduleName != string.Empty)
                    moduleName += ".";
                moduleName += str;
            }

            context.Values[MODULE] = moduleName;
        }
    }
}
