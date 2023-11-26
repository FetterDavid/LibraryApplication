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
    /// A "Librarian" (könyvtáros) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyvtárosok alapvető adatait tárolja.
    /// </summary>
    public class Librarian
    {
        /// <summary>
        /// A könyvtáros egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// A könyvtáros neve. Ez a mező kötelező.
        /// </summary>
        [Required]
        public string Name { get; set; }
        /// <summary>
        /// A könyvtáros felhasználóneve. Ez a mező kötelező, és azonosításra szolgál.
        /// </summary>
        [Required]
        public string UserName { get; set; }
        /// <summary>
        /// A könyvtáros jelszava. Ez a mező kötelező, és biztonsági okokból titkosítva kell tárolni.
        /// </summary>
        [Required]
        public string Password { get; set; }
        /// <summary>
        /// A könyvtáros e-mail címe. Ez a mező kötelező, és kommunikációs célokra használatos.
        /// </summary>
        [Required]
        public string Email { get; set; }
    }
}
