using System;
using System.Collections.Generic;
using System.Linq;
using CoreIn.Models.Infrastructure;
using CoreIn.Commons.ViewModels;

namespace CoreIn.App
{
    /// <summary>
    /// Giá trị trả về khi ajax request
    /// </summary>
    /// <typeparam name="TEntity"></typeparam>
    class EntitiesResult<TEntity> where TEntity : BaseEntity
    {
        public IEnumerable<BaseEntityViewModel> Entities { get; set; }

        //Đếm tổng số entity trước khi skip và take
        //Để tính toán số trang ở client
        public int TotalCount { get; set; }
    }
}