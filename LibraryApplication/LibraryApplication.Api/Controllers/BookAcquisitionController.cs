using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A könyvbeszerzések entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class BookAcquisitionController : LibraryControllerBase<BookAcquisition>
    {
        public BookAcquisitionController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
