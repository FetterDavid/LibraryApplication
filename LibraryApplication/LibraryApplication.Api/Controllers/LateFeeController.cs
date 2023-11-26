using LibraryApplication.Api.Controllers;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A szerző entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class LateFeeController : LibraryControllerBase<LateFee>
    {
        public LateFeeController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
