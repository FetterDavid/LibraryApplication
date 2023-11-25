using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryApplication.Contract.Models
{
    /// <summary>
    /// A "Book" (könyv) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyvek alapvető adatait tartalmazza.
    /// </summary>
    public class Book
    {
        /// <summary>
        /// A könyv egyedi leltári száma.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int InventoryNumber { get; set; }
        /// <summary>
        /// A könyv címe. Ez a mező kötelező.
        /// </summary>
        [Required]
        public string Title { get; set; }
        /// <summary>
        /// A könyv kiadási éve.
        /// </summary>
        public int PublicationYear { get; set; }
        /// <summary>
        /// A könyvet kiadó kiadó azonosítója.
        /// </summary>
        public int PublisherId { get; set; }
        /// <summary>
        /// A könyv szerzőjének azonosítója.
        /// </summary>
        public int AuthorId { get; set; }
        /// <summary>
        /// A könyv kategóriájának azonosítója.
        /// </summary>
        public int CategoryId { get; set; }
    }
}
