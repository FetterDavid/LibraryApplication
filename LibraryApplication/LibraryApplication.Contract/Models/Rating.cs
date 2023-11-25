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
    /// A "Rating" (értékelés) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyvek felhasználói értékeléseit tárolja.
    /// </summary>
    public class Rating
    {
        /// <summary>
        /// Az értékelés egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// A könyvet értékelő olvasó száma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public int ReaderNumber { get; set; }

        /// <summary>
        /// Az értékelt könyv leltári száma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public int InventoryNumber { get; set; }

        /// <summary>
        /// Az értékelés pontszáma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public int Point { get; set; }

        /// <summary>
        /// Az értékeléshez tartozó opcionális megjegyzés.
        /// </summary>
        public string Comment { get; set; }

        /// <summary>
        /// Az értékelés dátuma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public DateTime RatingDate { get; set; }
    }
}
