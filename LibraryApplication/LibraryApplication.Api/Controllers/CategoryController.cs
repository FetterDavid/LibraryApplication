using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : LibraryControllerBase<Category>
    {
        public CategoryController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
