using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BorrowingController : ControllerBase
    {
        private readonly LibraryContext _libraryContext;

        public BorrowingController(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }
        /// <summary>
        /// Delete a borrowing by id.
        /// </summary>
        /// <returns>A response indicating the success of the delete operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingBorowing = await _libraryContext.Borrowings.FindAsync(id);

            if (existingBorowing is null)
            {
                return NotFound();
            }

            _libraryContext.Borrowings.Remove(existingBorowing);
            await _libraryContext.SaveChangesAsync();

            return NoContent();
        }
        /// <summary>
        /// Creates a new borrowing.
        /// </summary>
        /// <param name="borrowing">The borrowing object to create.</param>
        /// <returns>A response indicating the success of the create operation.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Borrowing borrowing)
        {
            _libraryContext.Borrowings.Add(borrowing);
            await _libraryContext.SaveChangesAsync();
            return this.Ok();
        }
        /// <summary>
        /// Retrieves all borrowings.
        /// </summary>
        /// <returns>A list of all borrowings.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Borrowing>>> Get()
        {
            var borrowings = await this._libraryContext.Borrowings.ToListAsync();
            return this.Ok(borrowings);
        }
        /// <summary>
        /// Retrieves 1 borrowing by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Borrowing>> GetById(int id)
        {
            var borrowing = await _libraryContext.Borrowings.FindAsync(id);
            if (borrowing is null)
            {
                return NotFound();
            }
            return Ok(borrowing);
        }
    }
}
