using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LibrarianController : LibraryControllerBase<Librarian>
    {
        public LibrarianController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
