using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A kölcsönzések entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class BorrowingController : LibraryControllerBase<Borrowing>
    {
        public BorrowingController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
