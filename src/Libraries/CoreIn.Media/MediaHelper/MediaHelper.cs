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

namespace CoreIn.Media.MediaHelper
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
        private EntityType TypeImage { get; set; }
        private EntityType TypeOther { get; set; }

        public MediaHelper(
            CoreInDbContext dbContext,
            ITaxonomyHelper taxonomyHelper,
            IEntityHelper<FileEntity, FileEntityDetail> entityHelper, 
            IHostingEnvironment environment, IStringLocalizer<Language> stringLocalizer,
            IEntityTypeManager entityTypeManager,
            IEntityTaxonomyRelationHelper<FileEntityTaxonomy> entityTaxonomyRelationHelper
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
        }

        private void RegisterTypes()
        {
            var entityTypeGroup = "File Type";
            TypeImage = _entityTypeManager.RegisterEntityType(AppKey.FileTypeImage, new Dictionary<string, string> { { "title", "Image" }, { "group", entityTypeGroup } });
            TypeOther = _entityTypeManager.RegisterEntityType(AppKey.FileTypeOther, new Dictionary<string, string> { { "title", "Other" }, { "group", entityTypeGroup } });
        }

        private object FileEntityToObject(FileEntity fileEntity, bool includeDetails = false)
        {
            if (includeDetails)
                fileEntity.Details = _entityHelper.GetDetails(fileEntity).ToList() as IList<FileEntityDetail>;

            return new
            {
                fileId = fileEntity.Id.ToString(),
                fileName = fileEntity.Name,
                meta = fileEntity.Details?.ToDictionary(o => o.Field, o => o.Value)
            };
        }

        private void CropThumbnail(string imagePath, string savePath, Size thumbnailSize)
        {
            using (var image = new Image(imagePath))
            {
                image.Resize(new ResizeOptions { Mode = ResizeMode.Crop, Size = thumbnailSize });
                image.Save(savePath);
            }
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

        private DirectoryInfo UploadFolder()
            => new DirectoryInfo(_environment.WebRootPath);

        private void DeleteFileOnDisk(FileEntity fileEntity)
        {
            try
            {
                var details = _entityHelper.GetDetails(fileEntity);

                var fileThumbnail= details.FirstOrDefault(o => o.Field == "src_thumb")?.Value;
                var filePath = Path.Combine(_environment.WebRootPath, details.FirstOrDefault(o => o.Field == "src").Value);

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

        public async Task<FileEntityResult> Upload(IFormFileCollection files, User uploader)
        {
            if (TypeImage == null || TypeOther == null)
                RegisterTypes();

            var uploadDirectory = UploadFolder().ToString();
            var currentYear = DateTime.UtcNow.Year.ToString();
            var currentMonth = DateTime.UtcNow.Month.ToString();
            var currentDay = DateTime.UtcNow.Day.ToString();
            foreach (var file in files)
            {
                if (file.Length == 0)
                    return new FileEntityResult(JsonResultState.Failed, file.FileName, _stringLocalizer["The uploaded file lenght is zero!"]);

                var fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
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

                    var detailDictionary = new Dictionary<string, string>()
                    {
                        {"type", fileType.ToString()},
                        {"ext", fileExtension},
                        {"title", fileNameWithoutExtension},
                        {"src", Path.Combine(@"\", rawPath, fileName)},
                    };

                    if (thumbFileName != string.Empty)
                        detailDictionary.Add("src_thumb", Path.Combine(@"\", rawPath, thumbFileName));

                    _entityHelper.CreateDetails(fileEntity, detailDictionary, uploader);

                    Save();

                    return new FileEntityResult(JsonResultState.Success, fileName, "Upload completed!",FileEntityToObject(fileEntity));
                }
                catch (Exception e)
                {
                    return new FileEntityResult(JsonResultState.Failed, fileName, $"Error in saving file: {e.Message}");
                }
            }
            return null;
        }

        public object GetFileObject(string fileName)
        {
            var entity = _entityHelper.Entity(fileName);
            return FileEntityToObject(entity, true);
        }

        public IEnumerable<object> GetFileObjects(bool orderByAsc, int selectFrom, int take)
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
                yield return FileEntityToObject(fileEntity, true);
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

        public FileEntity Entity(string fileName)
            => _entityHelper.Entity(fileName);

        public FileEntityResult UpdateFile(long fileId, Dictionary<string, string> detailDictionary, Dictionary<long, long[]> taxonomyTypeTaxonomies, User byUser = null)
        {
            var entity = _entityHelper.Entity(fileId);
            try
            {
                var form = GetEntityForm(entity.EntityTypeId ?? 0);

                var newDetails = new Dictionary<string, string>();
                foreach (var formDetail in form.Details)
                {
                    var detailName = formDetail.Name.ToLower();
                    newDetails.Add(formDetail.Name, detailDictionary[detailName]);
                }

                _entityHelper.UpdateDetails(entity, newDetails, byUser);

                _taxonomyHelper.UpdateTaxonomiesForEntity<FileEntityTaxonomy>(entity.Id, entity.EntityTypeId ?? 0, taxonomyTypeTaxonomies);

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
                Details = new List<FormField>
                {
                    new FormField
                    {
                        Status = FieldStatus.ReadOnly,
                        Name = "src",
                        Display = new FieldDisplay
                        {
                            Title = _stringLocalizer["Url"]
                        }
                    },
                    new FormField
                    {
                        Name = "title",
                        Display = new FieldDisplay
                        {
                            Title = _stringLocalizer["Title"]
                        }
                    }
                },

                TaxonomyTypes = taxonomyTypesViewModels.Select( o => new FormTaxonomyType(o) )
            };
        }

        private List<FormField> GetTheFormMeta()
        {
            var result = new List<FormField>
            {
                new FormField
                {
                    Status = FieldStatus.Hidden,
                    Name = "id",
                }
            };
            return result;
        }

        private FormValues GetFormValueFor(FileEntity entity)
        {
            var formValues = new FormValues();
            formValues.Meta = new Dictionary<string, string>()
            {
                {"id", entity.Id.ToString() }
            };

            var entityDetails = _entityHelper.GetDetails(entity);
            formValues.Details = entityDetails.ToDictionary(o => o.Field, o => o.Value);

            formValues.TaxonomyTypes = new Dictionary<long, Dictionary<long, bool>>();
            var taxonomyTypesViewModels = _taxonomyHelper.GetTaxonomiesTypeViewModels(entity.EntityTypeId, true);
            foreach (var taxonomyTypeViewModel in taxonomyTypesViewModels)
            {
                var relateTaxonomies = _entityTaxonomyRelationHelper.GetTaxonomiesForEntity(entity.Id, taxonomyTypeViewModel.Id);
                formValues.TaxonomyTypes.Add(taxonomyTypeViewModel.Id, relateTaxonomies.ToDictionary(o => o.TaxonomyId, o => true));
            }

            return formValues;
        }

        public FileEntityResult GetEntityForm(string fileName)
        {
            var entity = Entity(fileName);
            var form = GetEntityForm(entity.EntityTypeId ?? 0);

            form.Meta.AddRange(GetTheFormMeta());
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

            var webroot = UploadFolder().FullName;

            var thumbFilePath = Path.Combine(Path.GetDirectoryName(sourceImage), thumbFileName);

            if (File.Exists(webroot + thumbFilePath))
                return thumbFilePath;

            return sourceImage;
        }

        private int Save()
            => _dbContext.SaveChanges();
    }
}
