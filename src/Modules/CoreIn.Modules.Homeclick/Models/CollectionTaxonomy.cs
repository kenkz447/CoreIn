﻿using System.Collections.Generic;
using CoreIn.Models.Infrastructure;
using System.ComponentModel.DataAnnotations.Schema;

namespace CoreIn.Modules.Homeclick.Models
{
    public class CollectionTaxonomy : BaseEntityTaxonomy
    {
        [ForeignKey("EntityId")]
        public virtual Collection Entity  { get;set;}
    }
}