using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookAcquisitionController : LibraryControllerBase<BookAcquisition>
    {
        public BookAcquisitionController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
