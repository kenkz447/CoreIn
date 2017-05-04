using System.Collections.Generic;
using System.Threading.Tasks;
using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using Microsoft.AspNetCore.Http;

namespace CoreIn.Media.MediaHelper
{
    public interface IMediaHelper
    {
        FileEntity Entity(string fileName);
        Task<FileEntityResult> Upload(IFormFileCollection files, User uploader);
        object GetFileObject(string fileName);
        IEnumerable<object> GetFileObjects(bool orderByAsc, int selectFrom, int take);
        FileEntityResult DeleteFile(string fileName);
        FileEntityResult UpdateFile(long fileId, Dictionary<string, string> detailDictionary, Dictionary<long, long[]> taxonomyTypeTaxonomies, User byUser = null);
        DynamicForm GetEntityForm(long entityTypeId);
        FileEntityResult GetEntityForm(string fileName);
        string GetThumbnailPath(string sourceImage);
    }
}