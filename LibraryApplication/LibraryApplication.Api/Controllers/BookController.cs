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
        /// Creates a new book.
        /// </summary>
        /// <param name="book">The book object to create.</param>
        /// <returns>A response indicating the success of the create operation.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Book book)
        {
            this._libraryContext.Books.Add(book);
            await this._libraryContext.SaveChangesAsync();

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
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> Get(int id)
        {
            var books = await this._libraryContext.Books.ToListAsync();
            return this.Ok(books);
        }

    }
}
