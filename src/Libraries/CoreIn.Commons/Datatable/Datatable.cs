using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons
{
    public class DatatableSort
    {
        public string Id { get; set; }
        public bool DESC { get; set; }
    }

    public class DatatableFilter
    {
        public string Id { get; set; }
        public string PivotId { get; set; }
        public string Value { get; set; }
    }

    public class Datatable
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public DatatableSort[] Sorting { get; set; }
        public DatatableFilter[] filtering { get; set; }
    }
}
