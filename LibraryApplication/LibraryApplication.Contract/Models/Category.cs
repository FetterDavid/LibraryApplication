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
    /// A "Category" (kategória) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyvek kategóriáinak információit tárolja.
    /// </summary>
    public class Category
    {
        /// <summary>
        /// A kategória egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// A kategória neve. Ez a mező kötelező.
        /// </summary>
        [Required]
        public string Name { get; set; }
    }
}
