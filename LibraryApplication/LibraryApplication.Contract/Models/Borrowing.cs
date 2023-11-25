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
    /// A "Borrowing" (kölcsönzés) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyvkölcsönzésekkel kapcsolatos információkat tárolja.
    /// </summary>
    public class Borrowing
    {
        /// <summary>
        /// A kölcsönzés egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// A könyvet kölcsönző olvasó száma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public int ReaderNumber { get; set; }
        /// <summary>
        /// A kölcsönzött könyv leltári száma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public int InventoryNumber { get; set; }
        /// <summary>
        /// A késedelmi díj mértéke, amennyiben a könyv késedelmesen kerül vissza.
        /// </summary>
        public int LateFee { get; set; }
        /// <summary>
        /// A kölcsönzés kezdő dátuma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public DateTime BorrowDate { get; set; }
        /// <summary>
        /// A könyv visszavitelének tervezett dátuma. Ez a mező kötelező.
        /// </summary>
        [Required]
        public DateTime ReturnDate { get; set; }
    }
}
