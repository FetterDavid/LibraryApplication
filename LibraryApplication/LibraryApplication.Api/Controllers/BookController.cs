using LibraryApplication.Api.Migrations;
using LibraryApplication.Api.Utils;
using LibraryApplication.Contract.DataTransferObjects;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    /// <summary>
    /// A könyvek entitására specializált kontroller.
    /// Az AuthorController az absztrakt LibraryControllerBase osztályból származik,
    /// </summary>
    [ApiController]
    [Route("[controller]")]
    public class BookController : LibraryControllerBase<Book>
    {
        public BookController(LibraryContext libraryContext) : base(libraryContext) { }
        /// <summary>
        /// Keresés a könyvek között a megadott keresési feltételek alapján.
        /// </summary>
        /// <param name="bookSearch">A keresési feltételeket tartalmazó DTO.</param>
        /// <returns>A megfelelő könyvek listája vagy NotFound, ha nincs találat.</returns>
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<Book>>> Search([FromQuery] BookSearch bookSearch)
        {
            var books = await _libraryContext.Books.ToListAsync();
            // Tartalmazza-e a keresett szöveget
            string[] words = bookSearch.Text.Split(' ');
            foreach (string word in words)
            {
                books = books.Where(x => Static.RemoveAccents(x.Title.ToLower()).Contains(Static.RemoveAccents(word.ToLower()))).ToList();
            }
            var borrowings = await _libraryContext.Borrowings.ToListAsync();
            // Bent van-e a könyv
            if (bookSearch.IsAvailable)
            {
                books = books.Where(x => !borrowings.Any(y => y.InventoryNumber == x.InventoryNumber)).ToList();
            }
            // Találtunk-e megfelelő könyvet
            if (books == null || books.Count == 0) return NotFound();
            // Rendezés
            switch (bookSearch.OrderBy)
            {
                case "TitleAsc":
                    books = books.OrderBy(x => x.Title).ToList();
                    break;
                case "TitleDesc":
                    books = books.OrderByDescending(x => x.Title).ToList();
                    break;
                default:
                    break;
            }
            return Ok(books);
        }

        [HttpDelete("deep/{bookId}")]
        public async Task<IActionResult> DeepDeleteBookById(int bookId)
        {
            Book book = await _libraryContext.Books.FindAsync(bookId);
            if (book == null)
            {
                return NotFound();
            }
            // kölcsönzések
            List<Borrowing> borrowings = await _libraryContext.Borrowings.ToListAsync();
            borrowings = borrowings?.Where(x => x.InventoryNumber == bookId).ToList();
            _libraryContext.Borrowings.RemoveRange(borrowings);
            // könyv beszerzések
            List<BookAcquisition> bookAcquisitions = await _libraryContext.BookAcquisitions.ToListAsync();
            bookAcquisitions = bookAcquisitions?.Where(x => x.InventoryNumber == bookId).ToList();
            _libraryContext.BookAcquisitions.RemoveRange(bookAcquisitions);
            // értékelések
            List<Rating> ratings = await _libraryContext.Ratings.ToListAsync();
            ratings = ratings?.Where(x => x.InventoryNumber == bookId).ToList();
            _libraryContext.Ratings.RemoveRange(ratings);
            _libraryContext.Books.Remove(book);
            await _libraryContext.SaveChangesAsync();
            return NoContent();
        }
    }
}
