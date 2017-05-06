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
        public string Title { get;}
        public string Description { get;}

        private Dictionary<string, FormViewModel> FormDictionary { get;}
        private Dictionary<string, string> ResourcesDictionary { get;}
        private Dictionary<string, object> Parameters { get; }

        public ActionViewModel(string title, string description = null, Dictionary<string, string> resourceDictionary = null, Dictionary<string, object> parameters = null)
        {
            this.Title = title;
            this.Description = description;
            this.ResourcesDictionary = resourceDictionary;
            this.FormDictionary = new Dictionary<string, FormViewModel>();
            this.Parameters = parameters;
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
                forms = this.FormDictionary.ToDictionary(o => o.Key, o => o.Value.GetRawData()),
                resources = this.ResourcesDictionary,
                parameters = this.Parameters
            };
            return result;
        }
    }
}
