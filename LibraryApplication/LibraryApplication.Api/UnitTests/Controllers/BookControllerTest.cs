using LibraryApplication.Api.Controllers;
using LibraryApplication.Contract.DataTransferObjects;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace LibraryApplication.Api.UnitTests.Controllers
{
    public class BookControllerTest
    {
        private LibraryContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new LibraryContext(options);
        }

        [Test]
        public async Task Search_WithCriteria_ReturnsFilteredBooks()
        {
            using var context = GetInMemoryDbContext();
            var controller = new BookController(context);
            // Tesztadatok hozzáadása
            context.Books.AddRange(
                new Book { Title = "Another Book" });
            await context.SaveChangesAsync();
            var bookSearch = new BookSearch
            {
                Text = "Book",
                IsAvailable = true,
                OrderBy = "TitleAsc"
            };
            var result = await controller.Search(bookSearch);
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var books = okResult.Value as IEnumerable<Book>;
            Assert.IsNotNull(books);
            Assert.IsTrue(books.Any());
        }

        [Test]
        public async Task DeepDeleteBookById_ExistingId_DeletesBookAndRelatedRecords()
        {
            using var context = GetInMemoryDbContext();
            var controller = new BookController(context);
            // Teszt könyv és kapcsolódó rekordok létrehozása
            var book = new Book { Title = "Test Book" };
            context.Books.Add(book);
            await context.SaveChangesAsync();
            // Feltételezzük, hogy van kölcsönzés, beszerzés és értékelés is, amik a könyvhöz kapcsolódnak
            context.Borrowings.Add(new Borrowing { InventoryNumber = book.InventoryNumber, ReaderNumber = 0, BorrowDate = DateTime.Now, ReturnDate = DateTime.Now });
            context.BookAcquisitions.Add(new BookAcquisition { InventoryNumber = book.InventoryNumber, AcquisitionDate = DateTime.Now, Price = 2000, AcquisitionSource = "test" });
            context.Ratings.Add(new Rating { InventoryNumber = book.InventoryNumber, RatingDate = DateTime.Now, Point = 5, ReaderNumber = 1, Comment = "test" });
            await context.SaveChangesAsync();
            // Metódus hívása
            var result = await controller.DeepDeleteBookById(book.InventoryNumber);
            // Ellenőrzések
            Assert.IsInstanceOf<NoContentResult>(result);
            Assert.IsNull(await context.Books.FindAsync(book.InventoryNumber));
            Assert.IsFalse(context.Borrowings.Any(b => b.InventoryNumber == book.InventoryNumber));
            Assert.IsFalse(context.BookAcquisitions.Any(ba => ba.InventoryNumber == book.InventoryNumber));
            Assert.IsFalse(context.Ratings.Any(r => r.InventoryNumber == book.InventoryNumber));
        }

    }
}
