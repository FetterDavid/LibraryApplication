using LibraryApplication.Contract.Models;
using LibraryApplication.Contract.DataTransferObjects;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LibrarianController : LibraryControllerBase<Librarian>
    {
        public LibrarianController(LibraryContext libraryContext) : base(libraryContext) { }

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
