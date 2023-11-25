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
    /// A "LateFee" (késedelmi díj) entitás modellje a könyvtári alkalmazásban.
    /// Ez az osztály a késedelmes könyvvisszavitel díjazásával kapcsolatos információkat tárolja.
    /// </summary>
    public class LateFee
    {
        /// <summary>
        /// A késedelmi díj egyedi azonosítója.
        /// Az adatbázisban automatikusan generált érték.
        /// </summary>
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        /// <summary>
        /// A késedelmi díj összege. Ez a mező kötelező.
        /// </summary>
        [Required]
        public double FeeAmount { get; set; }
        /// <summary>
        /// A késedelmes napok minimális száma, amitől kezdve a díjat felszámítják. Ez a mező kötelező.
        /// </summary>
        [Required]
        public int MinLateDays { get; set; }
    }
}
