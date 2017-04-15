using System.Collections.Generic;
using CoreIn.Models.Infrastructure;

namespace CoreIn.Models
{
    public class FileEntity : BaseEntity
    {
        public FileEntity()
        {
            Details = new HashSet<FileEntityDetail>();
            Children = new HashSet<FileEntity>();
            Taxonomies = new HashSet<FileEntityInTaxonomy>();
        }

        public virtual ICollection<FileEntityDetail> Details { get; set; }
        public virtual ICollection<FileEntity> Children { get; set; }
        public virtual ICollection<FileEntityInTaxonomy> Taxonomies { get; set; }
    }
}