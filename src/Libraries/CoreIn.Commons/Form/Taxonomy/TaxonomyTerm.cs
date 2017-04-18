using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json;
using CoreIn.Models;

namespace CoreIn.Commons.Form
{
    public class FormTaxonomy
    {
        public long Id { get; set; }
        public string Title { get; set; }
        public string Name { get; set; }
        public long? ParentId { get; set; }

        public FormTaxonomy()
        {

        }

        public FormTaxonomy(TaxonomyViewModel taxonomyViewModel)
        {
            Id = taxonomyViewModel.Id;
            Name = taxonomyViewModel.Name;
            Title = taxonomyViewModel.Title;
            ParentId = taxonomyViewModel.ParentId;
        }
    }
}
