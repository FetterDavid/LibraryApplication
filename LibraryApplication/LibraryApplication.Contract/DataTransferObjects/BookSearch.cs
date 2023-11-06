using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryApplication.Contract.DataTransferObjects
{
    public class BookSearch
    {
        [Required]
        public string Text { get; set; }
        [Required]
        public bool IsAvailable { get; set; }
        public string OrderBy { get; set; }
    }
}
