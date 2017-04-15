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
        FileEntityResult UpdateDetails(string entity, Dictionary<string, string> detailDictionary, User byUser);
        DynamicForm GetEntityForm();
        FileEntityResult GetEntityForm(string fileName);
    }
}