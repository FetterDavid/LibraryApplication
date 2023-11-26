using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        [HttpDelete("deep/{categoryId}")]
        public async Task<IActionResult> DeepDeleteCategoryById(int categoryId)
        {
            Category category = await _libraryContext.Categories.FindAsync(categoryId);
            if (category == null)
            {
                return NotFound();
            }
            List<Book> books = await _libraryContext.Books.ToListAsync();
            books = books?.Where(x => x.CategoryId == categoryId).ToList();
            _libraryContext.Books.RemoveRange(books);
            _libraryContext.Categories.Remove(category);
            await _libraryContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
