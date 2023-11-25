using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryApplication.Contract.DataTransferObjects
{
    /// <summary>
    /// A könyvtárosok bejelentkezési adatait tároló Data Transfer Object (DTO).
    /// Ez a DTO a könyvtári alkalmazásban a könyvtárosok bejelentkezési folyamatához használt információkat tartalmazza.
    /// </summary>
    public class LibrarianCredentials
    {
        /// <summary>
        /// A könyvtáros felhasználóneve. Ez a mező kötelező a bejelentkezés során.
        /// </summary>
        [Required]
        public string UserName { get; set; }

        /// <summary>
        /// A könyvtáros jelszava. Ez a mező kötelező a bejelentkezés során.
        /// </summary>
        [Required]
        public string Password { get; set; }
    }
}
