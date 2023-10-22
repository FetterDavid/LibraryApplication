using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PublisherController : ControllerBase
    {
        private readonly LibraryContext _libraryContext;

        public PublisherController(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }
        /// <summary>
        /// Delete a publisher by id.
        /// </summary>
        /// <returns>A response indicating the success of the delete operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingPublisher = await _libraryContext.Publishers.FindAsync(id);

            if (existingPublisher is null)
            {
                return NotFound();
            }

            _libraryContext.Publishers.Remove(existingPublisher);
            await _libraryContext.SaveChangesAsync();

            return NoContent();
        }
        /// <summary>
        /// Creates a new Publisher.
        /// </summary>
        /// <param name="publisher">The Publisher object to create.</param>
        /// <returns>A response indicating the success of the create operation.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Publisher publisher)
        {
            _libraryContext.Publishers.Add(publisher);
            await _libraryContext.SaveChangesAsync();
            return this.Ok();
        }
        /// <summary>
        /// Retrieves all publishers.
        /// </summary>
        /// <returns>A list of all publishers.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Publisher>>> Get()
        {
            var publishers = await this._libraryContext.Publishers.ToListAsync();
            return this.Ok(publishers);
        }
        /// <summary>
        /// Retrieves 1 publisher by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Publisher>> GetById(int id)
        {
            var publisher = await _libraryContext.Publishers.FindAsync(id);
            if (publisher is null)
            {
                return NotFound();
            }
            return Ok(publisher);
        }
    }
}
