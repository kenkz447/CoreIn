using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace CoreIn.Commons.Infrastructure
{
    public interface IDbContextSetter
    {
        void SetContext(DbContext context);
    }
}
