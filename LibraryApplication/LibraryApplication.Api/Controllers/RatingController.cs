using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class RatingController : LibraryControllerBase<Librarian>
    {
        public RatingController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
