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
        private readonly IEntityHelper<FileEntity, FileEntityDetail> _entityHelper;
        private readonly IHostingEnvironment _environment;
        private readonly IStringLocalizer<Language> _stringLocalizer;

        private EntityType TypeImage { get; }
        private EntityType TypeOther { get; }

        public MediaHelper(IEntityHelper<FileEntity, FileEntityDetail> entityHelper, IHostingEnvironment environment, IStringLocalizer<Language> stringLocalizer, IEntityTypeManager entityTypeManager)
        {
            _entityHelper = entityHelper;
            _environment = environment;
            _stringLocalizer = stringLocalizer;

            var entityTypeGroup = "File Type";

            TypeImage = entityTypeManager.RegisterEntityType(AppKey.FileTypeImage, new Dictionary<string, string> { { "title", "Image" }, { "group", entityTypeGroup } });
            TypeOther = entityTypeManager.RegisterEntityType(AppKey.FileTypeOther, new Dictionary<string, string> { { "title", "Other" }, { "group", entityTypeGroup } });
        }

        private object FileEntityToObject(FileEntity fileEntity, bool includeDetails = false)
        {
            if (includeDetails)
                fileEntity.Details = _entityHelper.Details(fileEntity).ToList() as IList<FileEntityDetail>;

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
                var details = _entityHelper.Details(fileEntity);

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
                        {"src", Path.Combine(rawPath, fileName)},
                    };
                    if (thumbFileName != string.Empty)
                        detailDictionary.Add("src_thumb", Path.Combine(rawPath, thumbFileName));

                    _entityHelper.CreateDetails(fileEntity, detailDictionary, uploader);

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

            if (_entityHelper.Delete(fileEntity) > 0)
                return new FileEntityResult(JsonResultState.Success, fileEntity.Name, _stringLocalizer["Deleted successfuly!"]);

            return new FileEntityResult(JsonResultState.Failed, fileName, _stringLocalizer["Delete failed!"]);
        }

        public FileEntity Entity(string fileName)
            => _entityHelper.Entity(fileName);

        public FileEntityResult UpdateDetails(string fileName, Dictionary<string, string> detailDictionary,
            User byUser)
        {
            var entity = Entity(fileName);

            var form = GetEntityForm();

            var newDetails = new Dictionary<string, string>();
            foreach (var formDetail in form.Details)
            {
                var detailName = formDetail.Input.Name.ToLower();
                newDetails.Add(formDetail.Input.Name, detailDictionary[detailName]);
            }

            var updateResult = _entityHelper.UpdateDetails(entity, newDetails, byUser);
            if (updateResult > 0)
                return new FileEntityResult(JsonResultState.Success, fileName, _stringLocalizer["Update successfuly!"]);

            return new FileEntityResult(JsonResultState.Failed, fileName, _stringLocalizer["Error!"]);
        }

        public DynamicForm GetEntityForm()
        {
            return new DynamicForm
            {
                Details = new List<FormField>
                {
                    new FormField
                    {
                        Input = new FieldInput("src"),
                        Validate = new FieldValidate
                        {
                            Type = "text"
                        },
                        Display = new FieldDisplay
                        {
                            RenderType = FieldRenderType.FormGroup,
                            Label = _stringLocalizer["Url"]
                        }
                    },
                    new FormField
                    {
                        Input = new FieldInput("title"),
                        Validate = new FieldValidate
                        {
                            Type = "text"
                        },
                        Display = new FieldDisplay
                        {
                            RenderType = FieldRenderType.FormGroup,
                            Label = _stringLocalizer["Title"]
                        }
                    },
                    new FormField
                    {
                        Input = new FieldInput("description"),
                        Validate = new FieldValidate
                        {
                            Type = "text"
                        },
                        Display = new FieldDisplay
                        {
                            RenderType = FieldRenderType.FormGroup,
                            Label = _stringLocalizer["Description"]
                        }
                    }
                },

                Taxonomies = new List<FormTaxonomy>{
                    new FormTaxonomy{
                        Order = 0,

                        Input = new FieldInput("category"),

                        Terms = new List<TaxonomyTerm> {
                            new TaxonomyTerm {
                                Title = "Category1",
                                Name = "c1",
                                ChildrenTerms = new List<TaxonomyTerm> {
                                    new TaxonomyTerm {
                                        Title = "Category Chilren 1",
                                        Name = "c6"
                                    },
                                    new TaxonomyTerm {
                                        Title = "Category Chilren 2",
                                        Name = "c7"
                                    }
                                }
                            }
                        },

                        Display = new FieldDisplay
                        {
                            RenderType = FieldRenderType.FormGroup,
                            Label = _stringLocalizer["Category"]
                        }
                    }
                }
            };
        }

        public FileEntityResult GetEntityForm(string fileName)
        {
            var entity = Entity(fileName);
            var entityDetails = _entityHelper.Details(entity).ToDictionary(o => o.Field,o => o.Value);

            var form = GetEntityForm();
            foreach (var formDetail in form.Details)
            {
                var detailName = formDetail.Input.Name.ToLower();
                if (!entityDetails.ContainsKey(detailName))
                    entityDetails.Add(detailName, string.Empty);
                formDetail.Input.Value = entityDetails[detailName];
            }

            var  result = new FileEntityResult(JsonResultState.Success, fileName, string.Empty, form);

            return result;
        }
    }
}
