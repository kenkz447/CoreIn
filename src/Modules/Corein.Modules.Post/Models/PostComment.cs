using CoreIn.Models.Infrastructure;
using System;
using System.ComponentModel.DataAnnotations;

namespace CoreIn.Modules.Post.Models
{
    public class PostComment : EntityWithTypedId<long>
    {
        public long EntityId { get; set; }

        public long? ReplyToCommentId { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        public string Author { get; set; }

        public string Email { get; set; }

        public string Url { get; set; }

        public DateTime Time { get; set; } = DateTime.UtcNow;

        public virtual PostEntity Entity { get; set; }

        public virtual PostComment ReplyToComment { get; set; }
    }
}