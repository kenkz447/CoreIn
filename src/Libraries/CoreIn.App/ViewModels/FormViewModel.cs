using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using CoreIn.App.Helpers;

namespace CoreIn.App.ViewModels
{
    using static MetaDataHelper;

    public class FormViewModel
    {
        private readonly Dictionary<string, FieldViewModel> _fieldObjects;

        public string Title { get; }
        public string Description { get; }
        
        public FormViewModel(string title, string description = null)
        {
            this.Title = title;
            this.Description = description;
            this._fieldObjects = new Dictionary<string, FieldViewModel>();
        }

        public void GenerateFields<TModel>(TModel model)
        {
            var type = model.GetType();
            var properties = type.GetProperties();
            foreach (var property in properties)
            {
                _fieldObjects.Add(property.Name.ToLower(), ReactDataFor(property, model));
            }
        }

        public object GetRawData()
        {
            var result = new
            {
                title = this.Title,
                description = this.Description,
                fields = _fieldObjects.ToDictionary(o => o.Key, o => o.Value.GetRawValue()),
                initialValues = _fieldObjects.ToDictionary(o => o.Value.Input["name"], o => o.Value.Input["value"])
            };
            return result;
        }
    }
}