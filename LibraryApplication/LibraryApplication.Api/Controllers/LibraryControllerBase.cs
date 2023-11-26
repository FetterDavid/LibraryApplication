using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// Absztrakt osztály az API kontroller alapjaihoz, amely generikus CRUD műveleteket biztosít.
    /// </summary>
    /// <typeparam name="TEntity">A kezelt entitás típusa.</typeparam>
    public abstract class LibraryControllerBase<TEntity> : ControllerBase where TEntity : class
    {
        protected readonly LibraryContext _libraryContext;
        /// <summary>
        /// Konstruktor a LibraryControllerBase osztályhoz.
        /// </summary>
        /// <param name="libraryContext">Az adatbázis kontextusa.</param>
        protected LibraryControllerBase(LibraryContext libraryContext)
        {
            this._libraryContext = libraryContext;
        }
        /// <summary>
        /// Entitás törlése azonosító alapján.
        /// </summary>
        /// <param name="id">Az entitás azonosítója.</param>
        /// <returns>IActionResult típusú válasz.</returns>
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
        /// <summary>
        /// Új entitás hozzáadása.
        /// </summary>
        /// <param name="entity">A hozzáadandó entitás.</param>
        /// <returns>IActionResult típusú válasz.</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TEntity entity)
        {
            _libraryContext.Set<TEntity>().Add(entity);
            await _libraryContext.SaveChangesAsync();
            return Ok();
        }
        /// <summary>
        /// Entitás frissítése azonosító alapján.
        /// </summary>
        /// <param name="id">Az entitás azonosítója.</param>
        /// <param name="entityToUpdate">A frissítendő entitás.</param>
        /// <returns>IActionResult típusú válasz.</returns>
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
        /// <summary>
        /// Összes entitás lekérdezése.
        /// </summary>
        /// <returns>Az entitások listája.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TEntity>>> Get()
        {
            var entities = await _libraryContext.Set<TEntity>().ToListAsync();
            return Ok(entities);
        }
        /// <summary>
        /// Egy adott entitás lekérdezése azonosító alapján.
        /// </summary>
        /// <param name="id">Az entitás azonosítója.</param>
        /// <returns>Az entitás vagy NotFound, ha nem található.</returns>
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
