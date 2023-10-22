using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BorrowingController : LibraryControllerBase<Borrowing>
    {
        public BorrowingController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
