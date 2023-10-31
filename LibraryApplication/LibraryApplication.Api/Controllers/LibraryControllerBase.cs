using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    public abstract class LibraryControllerBase<TEntity> : ControllerBase where TEntity : class
    {
        protected readonly LibraryContext _libraryContext;

        protected LibraryControllerBase(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var entity = await _libraryContext.Set<TEntity>().FindAsync(id);

            if (entity == null)
            {
                return NotFound();
            }

            _libraryContext.Set<TEntity>().Remove(entity);
            await _libraryContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TEntity entity)
        {
            _libraryContext.Set<TEntity>().Add(entity);
            await _libraryContext.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] TEntity entityToUpdate)
        {
            var entity = await _libraryContext.Set<TEntity>().FindAsync(id);
            if (entity == null)
            {
                return NotFound();
            }

            _libraryContext.Entry(entity).CurrentValues.SetValues(entityToUpdate);
            await _libraryContext.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TEntity>>> Get()
        {
            var entities = await _libraryContext.Set<TEntity>().ToListAsync();
            return Ok(entities);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TEntity>> GetById(int id)
        {
            var entity = await _libraryContext.Set<TEntity>().FindAsync(id);
            if (entity == null)
            {
                return NotFound();
            }
            return Ok(entity);
        }
    }
}
