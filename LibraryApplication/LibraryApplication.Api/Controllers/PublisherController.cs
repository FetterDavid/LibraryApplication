using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A kiadók entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>s
    [ApiController]
    [Route("[controller]")]
    public class PublisherController : LibraryControllerBase<Publisher>
    {
        public PublisherController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
