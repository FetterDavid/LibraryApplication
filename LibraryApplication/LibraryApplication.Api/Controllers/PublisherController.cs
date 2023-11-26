using LibraryApplication.Api.Migrations;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A kiadók entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>s
    [ApiController]
    [Route("[controller]")]
    public class PublisherController : LibraryControllerBase<Publisher>
    {
        public PublisherController(LibraryContext libraryContext) : base(libraryContext) { }

        [HttpDelete("deep/{publisherId}")]
        public async Task<IActionResult> DeepDeletePublisherById(int publisherId)
        {
            Publisher publisher = await _libraryContext.Publishers.FindAsync(publisherId);
            if (publisher == null)
            {
                return NotFound();
            }
            List<Book> books = await _libraryContext.Books.ToListAsync();
            books = books?.Where(x => x.PublisherId == publisherId).ToList();
            _libraryContext.Books.RemoveRange(books);
            _libraryContext.Publishers.Remove(publisher);
            await _libraryContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
