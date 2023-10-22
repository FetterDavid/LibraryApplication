using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthorController : LibraryControllerBase<Author>
    {
        public AuthorController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
