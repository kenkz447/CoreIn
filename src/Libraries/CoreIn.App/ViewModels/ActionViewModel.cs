using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Reflection;
using Microsoft.AspNetCore.Mvc;

namespace CoreIn.App.ViewModels
{
    public class ActionViewModel
    {
        public string Module { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string ViewLayout { get; set; }
        public string[] Scripts { get; set; }
        public string[] Styles { get; set; }

        private Dictionary<string, FormViewModel> FormDictionary { get;}
        private Dictionary<string, string> ResourcesDictionary { get;}
        private Dictionary<string, object> Parameters { get; }

        public ActionViewModel()
        {

        }

        public ActionViewModel(string title = null, 
            string description = null, 
            string module = null, 
            Dictionary<string, string> resourceDictionary = null, 
            Dictionary<string, object> parameters = null, 
            string viewLayout = null,
            string[] scripts = null, 
            string [] styles = null)
        {
            this.Module = module;
            this.Title = title;
            this.Description = description;
            this.ResourcesDictionary = resourceDictionary;
            this.FormDictionary = new Dictionary<string, FormViewModel>();
            this.ViewLayout = viewLayout;
            this.Parameters = parameters;
            this.Scripts = scripts;
            this.Styles = styles;
        }

        public void AddForm(FormViewModel formViewModel, string formName)
        {
            FormDictionary.Add(formName, formViewModel);
        }

        public object GetRawData()
        {
            var result = new
            {
                title = this.Title,
                description = this.Description,
                forms = this.FormDictionary?.ToDictionary(o => o.Key, o => o.Value.GetRawData()),
                resources = this.ResourcesDictionary,
                parameters = this.Parameters
            };
            return result;
        }
    }
}
