using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryApplication.Contract.Models
{
    public class BookAcquisition
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [Required]
        public int InventoryNumber { get; set; }
        public DateTime AcquisitionDate { get; set; }
        public double Price { get; set; }
        public string AcquisitionSource { get; set; }
    }
}
