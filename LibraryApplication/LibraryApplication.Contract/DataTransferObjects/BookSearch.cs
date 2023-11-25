using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LibraryApplication.Contract.DataTransferObjects
{
    /// <summary>
    /// A könyvkeresés kritériumait tároló Data Transfer Object (DTO).
    /// Ez a DTO a könyvtári alkalmazásban a könyvek kereséséhez használt információkat tartalmazza.
    /// </summary>
    public class BookSearch
    {
        /// <summary>
        /// A keresendő szöveg. Ez a mező kötelező.
        /// </summary>
        [Required]
        public string Text { get; set; }

        /// <summary>
        /// Jelzi, hogy csak az elérhető könyveket keresse-e. Ez a mező kötelező.
        /// </summary>
        [Required]
        public bool IsAvailable { get; set; }

        /// <summary>
        /// A találatok rendezési módja (pl. cím szerint növekvő, csökkenő). Ez a mező opcionális.
        /// </summary>
        public string OrderBy { get; set; }
    }
}
