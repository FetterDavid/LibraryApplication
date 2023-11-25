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
    /// Az "Author" (szerző) entitás modellje a könyvtári alkalmazásban.
    /// </summary>
    public class Author
    {
        /// <summary>
        /// Az Author entitás egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// A szerző neve. Ez a mező kötelező.
        /// </summary>
        [Required]
        public string Name { get; set; }
    }
}
