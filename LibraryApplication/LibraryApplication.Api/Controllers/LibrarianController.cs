using LibraryApplication.Contract.Models;
using LibraryApplication.Contract.DataTransferObjects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A könyvtárosok entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class LibrarianController : LibraryControllerBase<Librarian>
    {
        public LibrarianController(LibraryContext libraryContext) : base(libraryContext) { }
        /// <summary>
        /// Bejelentkezési folyamat kezelése a könyvtárosok számára.
        /// </summary>
        /// <param name="libCred">A bejelentkezési adatokat tartalmazó DTO.</param>
        /// <returns>A bejelentkezett könyvtáros objektuma vagy NotFound, ha a bejelentkezési adatok hibásak.</returns>
        [HttpGet("login")]
        public async Task<ActionResult<Librarian>> Login([FromQuery] LibrarianCredentials libCred)
        {
            Librarian? loggedLibrarian = await _libraryContext.Librarians.FirstOrDefaultAsync(x => x.UserName == libCred.UserName && x.Password == libCred.Password);
            if (loggedLibrarian == null)
            {
                return NotFound();
            }
            return Ok(loggedLibrarian);
        }
    }
}
