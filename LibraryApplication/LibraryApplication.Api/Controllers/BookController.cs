using LibraryApplication.Api.Migrations;
using LibraryApplication.Api.Utils;
using LibraryApplication.Contract.DataTransferObjects;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibraryApplication.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class BookController : LibraryControllerBase<Book>
    {
        public BookController(LibraryContext libraryContext) : base(libraryContext) { }

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
    }
}
