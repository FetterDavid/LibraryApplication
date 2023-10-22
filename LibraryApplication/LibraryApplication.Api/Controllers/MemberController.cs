using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MemberController : LibraryControllerBase<Member>
    {
        public MemberController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
