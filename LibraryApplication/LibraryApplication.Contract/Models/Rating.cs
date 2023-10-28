using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryApplication.Contract.Models
{
    public class Rating
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int ReaderNumber { get; set; }
        [Required]
        public int InventoryNumber { get; set; }
        [Required]
        public int Point { get; set; }
        public string Comment { get; set; }
        [Required]
        public DateTime RatingDate { get; set; }
    }
}
