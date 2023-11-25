using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryApplication.Contract.Models
{
    /// <summary>
    /// A "BookAcquisition" (könyvbeszerzés) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyvek beszerzésével kapcsolatos információkat tárolja.
    /// </summary>
    public class BookAcquisition
    {
        /// <summary>
        /// A beszerzés egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// A beszerzett könyv leltári száma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public int InventoryNumber { get; set; }
        /// <summary>
        /// A könyv beszerzésének dátuma.
        /// </summary>
        public DateTime AcquisitionDate { get; set; }
        /// <summary>
        /// A könyv beszerzési ára.
        /// </summary>
        public double Price { get; set; }
        /// <summary>
        /// A beszerzés forrása (pl. könyvkereskedő, kiadó, adomány).
        /// </summary>
        public string AcquisitionSource { get; set; }
    }
}
