using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : LibraryControllerBase<Book>
    {
        public BookController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
