using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : ControllerBase
    {
        private readonly LibraryContext _libraryContext;

        public BookController(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }
        /// <summary>
        /// Delete a book by id.
        /// </summary>
        /// <returns>A response indicating the success of the delete operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingBook = await _libraryContext.Books.FindAsync(id);

            if (existingBook is null)
            {
                return NotFound();
            }

            _libraryContext.Books.Remove(existingBook);
            await _libraryContext.SaveChangesAsync();

            return NoContent();
        }
        /// <summary>
        /// Creates a new book.
        /// </summary>
        /// <param name="book">The book object to create.</param>
        /// <returns>A response indicating the success of the create operation.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Book book)
        {
            _libraryContext.Books.Add(book);
            await _libraryContext.SaveChangesAsync();
            return this.Ok();
        }
        /// <summary>
        /// Retrieves all books.
        /// </summary>
        /// <returns>A list of all books.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> Get()
        {
            var books = await this._libraryContext.Books.ToListAsync();
            return this.Ok(books);
        }
        /// <summary>
        /// Retrieves 1 book by ID
        /// </summary>
        /// <returns>A list of all books.</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetById(int id)
        {
            var person = await _libraryContext.Books.FindAsync(id);
            if (person is null)
            {
                return NotFound();
            }
            return Ok(person);
        }
    }
}
