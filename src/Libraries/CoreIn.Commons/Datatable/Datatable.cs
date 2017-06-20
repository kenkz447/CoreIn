using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons
{
    public class DataSort
    {
        public string Id { get; set; }
        public bool DESC { get; set; }
    }

    public class DataFilter
    {
        public string Id { get; set; }
        public string PivotId { get; set; }
        public string Value { get; set; }
        public string Operator { get; set; }
    }

    public class DataRequest
    {
        public int Page { get; set; }
        public int PageSize { get; set; }
        public DataSort[] Sorted { get; set; }
        public List<DataFilter> Filtering { get; set; }
        public Dictionary<long, long> Taxonomies { get; set; }
        public string[] AdditionalFields { get; set; }
    }
}
