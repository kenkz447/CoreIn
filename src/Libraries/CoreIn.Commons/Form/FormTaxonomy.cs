using CoreIn.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace CoreIn.Commons.Form
{
    public class FormTaxonomyType
    {
        public FormTaxonomyType()
        {

        }

        public FormTaxonomyType(TaxonomyTypeViewModel taxonomyTypeViewModel)
        {
            TypeId = taxonomyTypeViewModel.Id;
            Input = new FieldInput(taxonomyTypeViewModel.Name);
            Taxonomies = taxonomyTypeViewModel.Taxonomies.Select(o => new FormTaxonomy(o));
            Display = new FieldDisplay
            {
                Title = taxonomyTypeViewModel.Title,
                RenderType = FieldRenderType.CheckBoxList
            };
        }

        public long TypeId { get; set; }
        public FieldInput Input { get; set; }
        public IEnumerable<FormTaxonomy> Taxonomies { get; set; }
        public FieldDisplay Display { get; set; }
    }
}