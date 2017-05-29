using System.Collections.Generic;
using System.Threading.Tasks;
using CoreIn.Commons.Form;
using CoreIn.Models;
using CoreIn.Models.Authentication;
using Microsoft.AspNetCore.Http;
using CoreIn.Media;

namespace CoreIn.Media
{
    public interface IMediaHelper
    {
        FileEntity Entity(string fileNameOrPath, bool includeDetails = false);
        Task<FileEntityResult> Upload(IFormFileCollection files, User uploader);
        ImageViewModel GetFileViewModel(string fileName);
        IEnumerable<ImageViewModel> GetFileViewModels(bool orderByAsc, int selectFrom, int take);
        FileEntityResult DeleteFile(string fileName);
        FileEntityResult Update(long fileId, IEnumerable<FileEntityDetail> details, Dictionary<long, long[]> taxonomyTypeTaxonomies, User byUser = null);
        DynamicForm GetEntityForm(long entityTypeId);
        FileEntityResult GetEntityForm(string fileName);
        string GetThumbnailPath(string sourceImage);
    }
}