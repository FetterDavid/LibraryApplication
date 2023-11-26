using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.IO;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A szerzők entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class AuthorController : LibraryControllerBase<Author>
    {
        public AuthorController(LibraryContext libraryContext) : base(libraryContext) { }

        [HttpDelete("deep/{authorId}")]
        public async Task<IActionResult> DeepDeleteAuthorById(int authorId)
        {
            Author author = await _libraryContext.Authors.FindAsync(authorId);
            if (author == null)
            {
                return NotFound();
            }
            List<Book> books = await _libraryContext.Books.ToListAsync();
            books = books?.Where(x => x.AuthorId == authorId).ToList();
            _libraryContext.Books.RemoveRange(books);
            _libraryContext.Authors.Remove(author);
            await _libraryContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
