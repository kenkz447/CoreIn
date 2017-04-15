using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreIn.Commons.App.Infrastructure;
using Microsoft.AspNetCore.Mvc.Filters;
using CoreIn.Commons.App.Attributes;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;
using CoreIn.Commons.Authentication.Models;
using CoreIn.Commons.App.Models;
using CoreIn.Commons.DataProviver.Domain;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Mvc.ViewFeatures;
using Microsoft.AspNetCore.Mvc.ViewFeatures.Internal;
using ImageSharp;
using ImageSharp.Processing;
using CoreIn.Commons.App.Helpers;
using CoreIn.Modules.FileMagager.Infrastructure.ViewModels;

namespace CoreIn.Modules.FileMagager.Controllers
{
    [Title("File Manager")]
    [Area("Admin")]
    [Authorize()]
    public class FileManagerController : Controller
    {
        #region[Construction]
        private IHostingEnvironment _environment;
        private UserManager<User> _userManager;
        private IRepository<Commons.App.Models.FileInfo> _fileInfoRepository;
        private IRepository<FileInfoDetail> _fileInfoDetailRepository;

        public FileManagerController(IHostingEnvironment env, UserManager<User> userManager, IRepository<Commons.App.Models.FileInfo> fileInfoRepository, IRepository<FileInfoDetail> fileInfoDetailRepository)
        {
            _environment = env;
            _userManager = userManager;
            _fileInfoRepository = fileInfoRepository;
            _fileInfoDetailRepository = fileInfoDetailRepository;
        }
        #endregion

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Update(FileInfoViewModel fileInfoViewModel)
        {
            try
            {
                var fileInfo = _fileInfoRepository.GetById(long.Parse(fileInfoViewModel.fileId));
                fileInfo.SetDetail("title", fileInfoViewModel.meta["title"])
                        .SetDetail("description", fileInfoViewModel.meta["description"]);
                _fileInfoDetailRepository.SaveChange();
                _fileInfoRepository.SaveChange();
            }
            catch (Exception)
            {
                throw;
            }

            return Json(null);
        }

        [HttpPost]
        public async Task<JsonResult> Upload()
        {
            try
            {
                var uploadDirectory = new DirectoryInfo(Path.Combine(_environment.WebRootPath, "uploads")).ToString();
                var year = DateTime.UtcNow.Year.ToString();
                var month = DateTime.UtcNow.Month.ToString();
                var day = DateTime.UtcNow.Day.ToString();
                foreach (var file in Request.Form.Files)
                {
                    if (file.Length == 0)
                        return Json(new { status = "failed", file = file.FileName, message = "The uploaded file lenght is zero!" });

                    var fileName = ContentDispositionHeaderValue
                        .Parse(file.ContentDisposition)
                        .FileName
                        .Trim('"');

                    var completeFileName = $"{year}{month}{day}_{DateTime.UtcNow.Millisecond}_{fileName}";

                    var fileType = MediaHelper.CheckFileType(completeFileName);

                    var path = Path.Combine(uploadDirectory, year, month);
                    if (!Directory.Exists(path))
                        Directory.CreateDirectory(path);

                    var savePath = Path.Combine(path, completeFileName);
                    using (FileStream fs = System.IO.File.Create(savePath))
                    {
                        await file.CopyToAsync(fs);
                        fs.Flush();
                    }

                    if (fileType == FileTypes.Image)
                    {
                        var thumbFilePath = Path.Combine((new System.IO.FileInfo(savePath)).Directory.FullName, getThumbName(completeFileName));
                        MediaHelper.CropThumbnail(savePath, 150, thumbFilePath);
                    }

                    var fileInfo = new Commons.App.Models.FileInfo
                    {
                        Name = completeFileName,
                        UploadedTime = DateTime.UtcNow,
                        Uploader = await _userManager.GetUserAsync(HttpContext.User),
                    };

                    _fileInfoRepository.AddAndSave(fileInfo);

                    var result = fileInfoToObject(fileInfo);
                    return Json(result);
                }
            }
            catch (Exception ex)
            {
                return Json(new { status = "errors", Message = $"Error in saving file: {ex.Message}" });
            }

            return Json("Something's gotta go wrong...");
        }

        [HttpPost]
        public JsonResult GetFile(string fileName)
        {
            try
            {
                var fileInfo = _fileInfoRepository.GetBy(m => m.Name == fileName);
                var result = fileInfoToObject(fileInfo, true);
                return Json(result);
            }
            catch (Exception ex)
            {
                return Json(new { stutus = "error", message = ex.Message });
            }
        }

        [HttpPost]
        public JsonResult GetFiles(int? selectFrom, int? take)
        {
            var queryFiles = _fileInfoRepository.Query().OrderByDescending(e => e.UploadedTime).Skip(selectFrom ?? 0).Take(take ?? 30);

            var selectedFiles = queryFiles.ToList();

            var result = new List<object>();
            
            foreach (var fileInfo in queryFiles)
            {
                var details = _fileInfoDetailRepository.Query();
                var pathToFile = getFilePath(fileInfo);

                var item = fileInfoToObject(fileInfo);

                result.Add(item);
            }

            return Json(result);
        }

        [HttpPost]
        public JsonResult DeleteFile(string fileName)
        {
            try
            {
                var fileInfo = _fileInfoRepository.GetBy(e => e.Name == fileName);
                _fileInfoRepository.Remove(fileInfo);
                _fileInfoRepository.SaveChange();
                deleteFileOnDisk(fileInfo);

                return Json(new { status = "success", message = "Delete successfuly!" });
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        [HttpPost]
        public JsonResult DeleteFiles(string[] fileNames)
        {
            try
            {
                foreach (var fileName in fileNames)
                {
                    var fileInfo = _fileInfoRepository.GetBy(e => e.Name == fileName);
                    _fileInfoRepository.Remove(fileInfo);
                    deleteFileOnDisk(fileInfo);
                }
                _fileInfoRepository.SaveChange();
                return Json(new { status = "success", message="Delete successfuly!"});
            }
            catch (Exception ex)
            {
                return Json(ex.Message);
            }
        }

        #region[Private methods]
        private string getThumbName(string sourceFileName)
        {
            return $"{Path.GetFileNameWithoutExtension(sourceFileName)}_thumb{Path.GetExtension(sourceFileName)}";
        }

        private string getFilePath(Commons.App.Models.FileInfo fileInfo, bool includeFileName = true, bool includeServerRootPath = false, IHostingEnvironment environment = null)
        {
            var path = Path.Combine("uploads", fileInfo.UploadedTime.Value.Year.ToString(), fileInfo.UploadedTime.Value.Month.ToString());
            if (includeFileName)
                path = Path.Combine(path, fileInfo.Name);
            if (includeServerRootPath)
                path = Path.Combine(environment.WebRootPath, path);
            return path;
        }

        private void deleteFileOnDisk(Commons.App.Models.FileInfo fileInfo)
        {
            var fileName = fileInfo.Name;
            var fileType = MediaHelper.CheckFileType(fileName);
            var filePath = getFilePath(fileInfo, includeServerRootPath: true, environment: _environment);

            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            if (fileType == FileTypes.Image)
            {
                var thumbFilePath = Path.Combine((new System.IO.FileInfo(filePath)).Directory.FullName, getThumbName(fileName));
                if (System.IO.File.Exists(thumbFilePath))
                    System.IO.File.Delete(thumbFilePath);
            }
        }

        private object fileInfoToObject(Commons.App.Models.FileInfo fileInfo, bool includeDetails = false)
        {
            var fileName = fileInfo.Name;
            var fileType = MediaHelper.CheckFileType(fileName);
            if (includeDetails)
                fileInfo.Details = _fileInfoDetailRepository.Query().Where(m => m.FileInfoId == fileInfo.Id).ToList();

            return new FileInfoViewModel
            {
                fileId = fileInfo.Id.ToString(),
                fileName = fileInfo.Name,
                meta = new
                {
                    type = fileType.ToString(),
                    ext = Path.GetExtension(fileName),
                    title = fileInfo.GetDetail("title"),
                    description = fileInfo.GetDetail("description"),
                    src = Path.Combine(Url.SiteRootUrl(), getFilePath(fileInfo)),
                    src_thumb = (fileType == FileTypes.Image) ? Path.Combine(Url.SiteRootUrl(), getFilePath(fileInfo, includeFileName: false), getThumbName(fileName)) : null
                }.ToDictionary<string>()
            };
        }
        #endregion
    }
}
