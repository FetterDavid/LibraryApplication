using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A késedelmidíjaK entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class RatingController : LibraryControllerBase<Librarian>
    {
        public RatingController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
