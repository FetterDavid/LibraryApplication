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
    /// A "Publisher" (kiadó) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyveket kiadó kiadók alapvető adatait tárolja.
    /// </summary>
    public class Publisher
    {
        /// <summary>
        /// A kiadó egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        /// <summary>
        /// A kiadó neve. Ez a mező kötelező.
        /// </summary>
        [Required]
        public string Name { get; set; }
    }
}
