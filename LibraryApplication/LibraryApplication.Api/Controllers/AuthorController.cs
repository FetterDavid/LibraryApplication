using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A szerzők entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class AuthorController : LibraryControllerBase<Author>
    {
        public AuthorController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
