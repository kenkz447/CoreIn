using CoreIn.Commons;
using CoreIn.Modules.Post.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using System.Linq;

namespace Corein.Modules.Post.Controllers
{
    public class PostCommentController : Controller
    {
        private readonly IRepository<PostComment> _postCommentRepository;

        public PostCommentController(CoreInDbContext context, IRepository<PostComment> postCommentRepository)
        {
            _postCommentRepository = postCommentRepository;
            _postCommentRepository.SetContext(context);
        }

        [HttpPost]
        public JsonResult Create(PostComment comment)
        {
            _postCommentRepository.Add(comment);
            _postCommentRepository.SaveChange();

            return Json(comment);
        }

        [HttpGet]
        public JsonResult Get(long entityId)
        {
            var result = _postCommentRepository.Query(o => o.EntityId == entityId).ToList();
            return Json(result);
        }

        [HttpDelete]
        public JsonResult Delete(long id)
        {
            var comment = _postCommentRepository.GetById(id);

            _postCommentRepository.Delete(comment);
            _postCommentRepository.SaveChange();

            return Json(true);
        }

        [HttpPut]
        public JsonResult Edit(PostComment comment)
        {
            _postCommentRepository.Update(comment);
            _postCommentRepository.SaveChange();

            return Json(true);
        }
    }
}
