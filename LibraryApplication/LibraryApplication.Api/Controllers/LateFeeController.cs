using LibraryApplication.Api.Controllers;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class LateFeeController : LibraryControllerBase<LateFee>
    {
        public LateFeeController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
