using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Reflection;
namespace CoreIn.App.ViewModels
{
    public class ActionViewModel
    {
        public string Title { get;}
        public string Description { get;}

        private Dictionary<string, FormViewModel> FormDictionary { get;}
        private Dictionary<string, string> ResourcesDictionary { get;}

        public ActionViewModel(string title, string description = null, Dictionary<string, string> resourceDictionary = null )
        {
            this.Title = title;
            this.Description = description;
            this.ResourcesDictionary = resourceDictionary;
            this.FormDictionary = new Dictionary<string, FormViewModel>();
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
                resources = this.ResourcesDictionary
            };
            return result;
        }
    }
}
