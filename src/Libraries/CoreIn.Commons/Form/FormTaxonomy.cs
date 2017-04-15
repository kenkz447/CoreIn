using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Form
{
    public class FormTaxonomy
    {
        public int Order { get; set; }
        public FieldInput Input { get; set; }
        public IEnumerable<TaxonomyTerm> Terms { get; set; }
        public FieldDisplay Display { get; set; }
    }
}
