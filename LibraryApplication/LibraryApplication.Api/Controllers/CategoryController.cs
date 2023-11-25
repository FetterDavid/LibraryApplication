using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A kategóriák entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class CategoryController : LibraryControllerBase<Category>
    {
        public CategoryController(LibraryContext libraryContext) : base(libraryContext) { }
    }
}
