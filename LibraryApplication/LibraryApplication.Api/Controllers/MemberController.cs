using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A tagok entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class MemberController : LibraryControllerBase<Member>
    {
        public MemberController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
