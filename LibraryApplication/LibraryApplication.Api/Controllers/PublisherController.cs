using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PublisherController : LibraryControllerBase<Publisher>
    {
        public PublisherController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
