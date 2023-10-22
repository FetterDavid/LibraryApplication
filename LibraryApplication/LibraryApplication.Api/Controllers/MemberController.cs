using LibraryApplication.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class MemberController : ControllerBase
    {
        private readonly LibraryContext _libraryContext;

        public MemberController(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }
        /// <summary>
        /// Delete a member by id.
        /// </summary>
        /// <returns>A response indicating the success of the delete operation.</returns>
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingMember = await _libraryContext.Members.FindAsync(id);

            if (existingMember is null)
            {
                return NotFound();
            }

            _libraryContext.Members.Remove(existingMember);
            await _libraryContext.SaveChangesAsync();

            return NoContent();
        }
        /// <summary>
        /// Creates a new member.
        /// </summary>
        /// <param name="member">The member object to create.</param>
        /// <returns>A response indicating the success of the create operation.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Member member)
        {
            _libraryContext.Members.Add(member);
            await _libraryContext.SaveChangesAsync();
            return this.Ok();
        }
        /// <summary>
        /// Retrieves all books.
        /// </summary>
        /// <returns>A list of all books.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Member>>> Get()
        {
            var members = await this._libraryContext.Members.ToListAsync();
            return this.Ok(members);
        }
        /// <summary>
        /// Retrieves 1 member by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetById(int id)
        {
            var member = await _libraryContext.Members.FindAsync(id);
            if (member is null)
            {
                return NotFound();
            }
            return Ok(member);
        }
    }
}
