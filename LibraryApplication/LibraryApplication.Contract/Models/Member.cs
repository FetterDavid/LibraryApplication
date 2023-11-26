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
    /// A "Member" (tag) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a könyvtár tagjainak alapvető adatait tárolja.
    /// </summary>
    public class Member
    {
        /// <summary>
        /// A tag egyedi olvasószáma.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int ReaderNumber { get; set; }

        /// <summary>
        /// A tag neve. Ez a mező kötelező.
        /// </summary>
        [Required]
        public string Name { get; set; }

        /// <summary>
        /// A tag e-mail címe. Ez a mező kötelező, és kommunikációs célokra használatos.
        /// </summary>
        [Required]
        public string Email { get; set; }

        /// <summary>
        /// A tag tagságának típusa (pl. diák, felnőtt, nyugdíjas).
        /// Ez a mező opcionális.
        /// </summary>
        public string MembershipType { get; set; }

        /// <summary>
        /// Az év, amikor a tag tagsága kezdődött.
        /// Ez a mező opcionális és segít nyomon követni a tagság időtartamát.
        /// </summary>
        public int MembershipStartYear { get; set; }
    }
}
