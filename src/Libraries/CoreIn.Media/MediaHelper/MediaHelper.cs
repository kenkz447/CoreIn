using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CoreIn.Commons;
using CoreIn.Commons.EntityHelper;
using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using CoreIn.Resources.ConstantKeys;
using ImageSharp;
using ImageSharp.Processing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Localization;
using Microsoft.Net.Http.Headers;
using CoreIn.EntityCore;

namespace CoreIn.Media
{
    public class MediaHelper : IMediaHelper
    {
        private readonly CoreInDbContext _dbContext;
        private readonly IEntityHelper<FileEntity, FileEntityDetail> _entityHelper;
        private readonly IHostingEnvironment _environment;
        private readonly IStringLocalizer<Language> _stringLocalizer;
        private readonly ITaxonomyHelper _taxonomyHelper;
        private readonly IEntityTaxonomyRelationHelper<FileEntityTaxonomy> _entityTaxonomyRelationHelper;
        private readonly IEntityTypeManager _entityTypeManager;
        private readonly IHttpContextAccessor _context;

        private EntityType TypeImage { get; set; }
        private EntityType TypeOther { get; set; }

        public MediaHelper(
            CoreInDbContext dbContext,
            ITaxonomyHelper taxonomyHelper,
            IEntityHelper<FileEntity, FileEntityDetail> entityHelper, 
            IHostingEnvironment environment, IStringLocalizer<Language> stringLocalizer,
            IEntityTypeManager entityTypeManager,
            IEntityTaxonomyRelationHelper<FileEntityTaxonomy> entityTaxonomyRelationHelper,
            IHttpContextAccessor context
            )
        {
            _dbContext = dbContext;

            _taxonomyHelper = taxonomyHelper;

            _entityHelper = entityHelper;
            _entityHelper.SetContext(_dbContext);

            _entityTypeManager = entityTypeManager;

            _environment = environment;
            _stringLocalizer = stringLocalizer;

            _entityTaxonomyRelationHelper = entityTaxonomyRelationHelper;
            _context = context;
        }

        public Size GetImageDimension(string imagePath)
        {
            using (var image = new Image(imagePath))
            {
                return new Size(image.Width, image.Height);
            }
        }

        public async Task<FileEntityResult> Upload(IFormFileCollection files, User uploader)
        {
            if (TypeImage == null || TypeOther == null)
                RegisterTypes();

            var uploadDirectory = GetWebRootDirectoryInfo().ToString();
            var currentYear = DateTime.UtcNow.Year.ToString();
            var currentMonth = DateTime.UtcNow.Month.ToString();
            var currentDay = DateTime.UtcNow.Day.ToString();
            foreach (var file in files)
            {
                var fileLength = file.Length;
                if (fileLength == 0)
                    return new FileEntityResult(JsonResultState.Failed, file.FileName, _stringLocalizer["The uploaded file lenght is zero!"]);

                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.ToString().Trim('"');
                var fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                var fileExtension = Path.GetExtension(fileName);

                fileName = $"{fileNameWithoutExtension}-{currentYear}-{currentMonth}-{currentDay}-{DateTime.UtcNow.Millisecond}{fileExtension}";

                try
                {
                    var fileType = CheckFileType(fileName);
                    var rawPath = Path.Combine(AppKey.UploadFolder, uploader.Id.ToString(), currentYear, currentMonth);

                    var destinationFolderPath = Path.Combine(uploadDirectory, rawPath);
                    if (!Directory.Exists(destinationFolderPath))
                        Directory.CreateDirectory(destinationFolderPath);

                    var fileSavePath = Path.Combine(destinationFolderPath, fileName);
                    using (var fileStream = File.Create(fileSavePath))
                    {
                        await file.CopyToAsync(fileStream);
                        fileStream.Flush();
                    }

                    var thumbFileName = string.Empty;
                    if (fileType == FileType.Image)
                    {
                        thumbFileName = GetThumbnailFileName(fileName);
                        var thumbFilePath = Path.Combine((new FileInfo(fileSavePath)).Directory.FullName, thumbFileName);
                        CropThumbnail(fileSavePath, thumbFilePath, new Size(150, 150));
                    }

                    var entityType = fileType == FileType.Image ? TypeImage : TypeOther;

                    var fileEntity = _entityHelper.CreateEntity(entityType, fileName, uploader);

                    var detailViewModel = new ImageViewModel()
                    {
                        Url = Path.Combine(rawPath, fileName).Replace('\\','/'),
                        Size = fileLength.SizeSuffix(),
                        Title = fileNameWithoutExtension,
                        Extension = fileExtension,
                        Type = fileType.ToString()
                    };

                    if (thumbFileName != string.Empty)
                        detailViewModel.UrlThumb = Path.Combine(rawPath, thumbFileName).Replace('\\', '/');

                    if (fileType == FileType.Image)
                        detailViewModel.Dimension = GetImageDimension(fileSavePath).ToString();

                    var detailDictionary = detailViewModel.ToDictionary<string>();
                    _entityHelper.CreateDetails(fileEntity, detailDictionary, uploader);

                    Save();

                    return new FileEntityResult(JsonResultState.Success, fileName, "Upload completed!",FileEntityToViewModel(fileEntity));
                }
                catch (Exception e)
                {
                    return new FileEntityResult(JsonResultState.Failed, fileName, $"Error in saving file: {e.Message}");
                }
            }
            return null;
        }

        public ImageViewModel GetFileViewModel(string fileName)
        {
            var entity = _entityHelper.Entity(fileName);
            return FileEntityToViewModel(entity);
        }

        public IEnumerable<ImageViewModel> GetFileViewModels(bool orderByAsc, int selectFrom, int take)
        {
            var queryFiles = _entityHelper.Entities();
            if (!orderByAsc)
                queryFiles = queryFiles.OrderByDescending(e => e.Id);
            if (selectFrom != 0)
                queryFiles = queryFiles.Skip(selectFrom);
            if (take != 0)
                queryFiles = queryFiles.Take(take);

            var files = queryFiles.ToList();
            foreach (var fileEntity in files)
            {
                yield return FileEntityToViewModel(fileEntity);
            }
        }

        public FileEntityResult DeleteFile(string fileName)
        {
            var fileEntity = _entityHelper.Entity(fileName);
            DeleteFileOnDisk(fileEntity);

            _entityHelper.Delete(fileEntity);

            var result = Save();
            if ( result > 0)
                return new FileEntityResult(JsonResultState.Success, fileEntity.Name, _stringLocalizer["Deleted successfuly!"]);

            return new FileEntityResult(JsonResultState.Failed, fileName, _stringLocalizer["Delete failed!"]);
        }

        public FileEntity Entity(string fileNameOrPath, bool includeDetails = false)
        {
            var entity = _entityHelper.Entity(Path.GetFileName(fileNameOrPath));
            if (entity != null && includeDetails)
                entity.Details = _entityHelper.GetDetails(entity).ToList();
            return entity;
        }

        public FileEntityResult Update(long fileId, IEnumerable<FileEntityDetail> details, Dictionary<long, long[]> taxonomyTypeTaxonomies, User byUser = null)
        {
            var entity = BaseEntityController.Update<FileEntity, FileEntityDetail, FileEntityTaxonomy>(_entityHelper, _taxonomyHelper, fileId, details, taxonomyTypeTaxonomies, byUser, false);
            try
            {
                Save();
                return new FileEntityResult(JsonResultState.Success, entity.Name, _stringLocalizer["Update successfuly!"]);
            }
            catch (Exception ex)
            {
                return new FileEntityResult(JsonResultState.Failed, entity.Name, ex.Message);
            }
        }

        public DynamicForm GetEntityForm(long entityTypeId)
        {
            var taxonomyTypesViewModels = _taxonomyHelper.GetTaxonomiesTypeViewModels(entityTypeId, true);

            return new DynamicForm
            {
                Details = FormUtitities.ViewModelTypeToFormField(typeof(ImageViewModel), _stringLocalizer),
                TaxonomyTypes = taxonomyTypesViewModels.Select( o => new FormTaxonomyType(o) )
            };
        }

        public FileEntityResult GetEntityForm(string fileName)
        {
            var entity = Entity(fileName);
            var form = GetEntityForm(entity.EntityTypeId ?? 0);

            form.InitialValues = GetFormValueFor(entity);

            var result = new FileEntityResult(JsonResultState.Success, fileName, null, form);
            return result;
        }

        public string GetThumbnailPath(string sourceImage)
        {
            if (sourceImage == null || sourceImage == string.Empty)
                return null;

            var fileName = Path.GetFileName(sourceImage);
            var thumbFileName = GetThumbnailFileName(fileName);

            var webroot = GetWebRootDirectoryInfo().FullName;

            var thumbFilePath = Path.Combine(Path.GetDirectoryName(sourceImage), thumbFileName);

            if (File.Exists(webroot + thumbFilePath))
                return thumbFilePath;

            return sourceImage;
        }

        private int Save()
            => _dbContext.SaveChanges();

        #region Private Methods
        private void RegisterTypes()
        {
            var entityTypeGroup = "File Type";
            TypeImage = _entityTypeManager.RegisterEntityType(AppKey.FileTypeImage, new Dictionary<string, string> { { "title", "Image" }, { "group", entityTypeGroup } });
            TypeOther = _entityTypeManager.RegisterEntityType(AppKey.FileTypeOther, new Dictionary<string, string> { { "title", "Other" }, { "group", entityTypeGroup } });
        }

        private ImageViewModel FileEntityToViewModel(FileEntity fileEntity)
        {
            fileEntity.Details = _entityHelper.GetDetails(fileEntity).ToList() as IList<FileEntityDetail>;

            foreach (var detail in fileEntity.Details)
                detail.Suffix = detail.Field;

            var viewModel = FormUtitities.CreateObjectFormEntityDetails(typeof(ImageViewModel), fileEntity.Details) as ImageViewModel;
            viewModel.SetId(fileEntity.Id);
            viewModel.FileName = fileEntity.Name;

            return viewModel;
        }

        private void CropThumbnail(string imagePath, string savePath, Size thumbnailSize)
        {
            using (var image = new Image(imagePath))
            {
                image.Resize(new ResizeOptions { Mode = ResizeMode.Crop, Size = thumbnailSize });
                image.Save(savePath);
            }
        }

        private FormValues GetFormValueFor(FileEntity entity)
        {
            var formValues = new FormValues();
            formValues.Meta = new Dictionary<string, string>()
            {
                {"id", entity.Id.ToString() }
            };
            formValues.Details = new Dictionary<string, string>();

            var host = $"{_context.HttpContext.Request.Scheme}://{_context.HttpContext.Request.Host}";

            var entityDetails = _entityHelper.GetDetails(entity);
            var details = entityDetails.ToDictionary(o => o.Field, o => o.Value);
            foreach (var detail in details)
            {
                var value = detail.Value;

                if (detail.Key.StartsWith("url"))
                    value = $"{host}/{detail.Value}";

                formValues.Details.Add(detail.Key, value);
            }

            formValues.TaxonomyTypes = new Dictionary<long, Dictionary<long, bool>>();
            var taxonomyTypesViewModels = _taxonomyHelper.GetTaxonomiesTypeViewModels(entity.EntityTypeId, true);
            foreach (var taxonomyTypeViewModel in taxonomyTypesViewModels)
            {
                var relateTaxonomies = _entityTaxonomyRelationHelper.GetTaxonomiesForEntity(entity.Id, taxonomyTypeViewModel.Id);
                formValues.TaxonomyTypes.Add(taxonomyTypeViewModel.Id, relateTaxonomies.ToDictionary(o => o.TaxonomyId, o => true));
            }

            return formValues;
        }

        private string GetThumbnailFileName(string sourceFileName)
            => $"{Path.GetFileNameWithoutExtension(sourceFileName)}_thumb{Path.GetExtension(sourceFileName)}";

        private FileType CheckFileType(string fileName)
        {
            switch (Path.GetExtension(fileName))
            {
                case ".jpg":
                case ".png":
                    return FileType.Image;
                default:
                    return FileType.Other;
            }
        }

        private DirectoryInfo GetWebRootDirectoryInfo()
            => new DirectoryInfo(_environment.WebRootPath);

        private void DeleteFileOnDisk(FileEntity fileEntity)
        {
            try
            {
                var details = _entityHelper.GetDetails(fileEntity);

                var fileThumbnail = Path.Combine(_environment.WebRootPath, details.FirstOrDefault(o => o.Field == AppKey.FileThumbUrlPropertyName)?.Value);
                var filePath = Path.Combine(_environment.WebRootPath, details.FirstOrDefault(o => o.Field == AppKey.FileUrlPropertyName).Value);

                if (File.Exists(filePath))
                    File.Delete(filePath);

                if (fileThumbnail != null && File.Exists(fileThumbnail))
                    File.Delete(fileThumbnail);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }
        #endregion
    }
}
