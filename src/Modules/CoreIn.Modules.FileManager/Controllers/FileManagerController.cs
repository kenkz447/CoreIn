﻿using CoreIn.App;
using CoreIn.App.Attributes;
using CoreIn.App.ViewModels;
using CoreIn.Commons;
using CoreIn.Commons.Form;
using CoreIn.Media;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreIn.Modules.FileManager.Controllers
{
    [Title("File Manager")]
    [Authorize]
    public class FileManagerController : Controller
    {
        private readonly IMediaHelper _mediaHelper;
        private readonly UserManager<User> _userManager;

        public FileManagerController(IMediaHelper mediaHelper, UserManager<User> userManager)
        {
            _mediaHelper = mediaHelper;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            var viewModel = new ActionViewModel("File Manager", module: "Admin");
            return View(viewModel);
        }

        [HttpPut]
        public async Task<JsonResult> Update(FormValues<ImageViewModel> formValues)
        {
            var user = await _userManager.FindByNameAsync(User.Identity.Name);
            var fileId = long.Parse(formValues.GetMetaValue("id"));
            Dictionary<long, long[]> taxonomyTypeTaxonomies = formValues.TaxonomyTypes?.ToDictionary(o => o.Key, o => o.Value.Keys.ToArray());
            var entityDetails = FormUtitities.ViewModelToEntityDetails<FileEntityDetail>(formValues.Details, formValues.Language);
            var result = _mediaHelper.Update(fileId, entityDetails, taxonomyTypeTaxonomies, user);
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> Upload()
        {
            var uploader = await _userManager.FindByNameAsync(User.Identity.Name);
            var uploadResult = await _mediaHelper.Upload(Request.Form.Files, uploader);

            return Json(uploadResult);
        }

        [HttpGet]
        public JsonResult GetFile(string fileName)
        {
            var result = _mediaHelper.GetFileViewModel(fileName);
            return Json(result);
        }

        [HttpGet]
        public JsonResult GetFiles(int? selectFrom, int? take)
        {
            var result = _mediaHelper.GetFileViewModels(false, selectFrom ?? 0, take ?? 0);
            return Json(result);
        }

        [HttpDelete]
        public JsonResult DeleteFiles(string[] fileNames)
        {
            var result = new List<object>();
            foreach (var fileName in fileNames)
            {
                var deleteResult = _mediaHelper.DeleteFile(fileName);
                result.Add(deleteResult);
            }
            return Json(result);
        }

        [HttpGet]
        public JsonResult GetFormFor(string fileName)
        {
            var result = _mediaHelper.GetEntityForm(fileName);
            return Json(result);
        }
    }
}