using LibraryApplication.Api.Controllers;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace LibraryApplication.Api.UnitTests.Controllers
{
    public class PublisherControllerTest
    {
        private LibraryContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new LibraryContext(options);
        }

        [Test]
        public async Task DeepDeleteAuthorById_ExistingId_DeletesAuthorAndRelatedBooks()
        {
            using var context = GetInMemoryDbContext();
            var controller = new AuthorController(context);
            // Tesztadatok: Szerző és kapcsolódó könyvek létrehozása
            var author = new Author { Name = "Test Author" };
            context.Authors.Add(author);
            await context.SaveChangesAsync();
            var book1 = new Book { Title = "Book 1", AuthorId = author.Id };
            var book2 = new Book { Title = "Book 2", AuthorId = author.Id };
            context.Books.AddRange(book1, book2);
            await context.SaveChangesAsync();
            // Ellenőrzés, hogy a könyvek léteznek
            Assert.IsTrue(context.Books.Any(b => b.AuthorId == author.Id));
            // Metódus hívása a szerző azonosítójával
            var result = await controller.DeepDeleteAuthorById(author.Id);
            // Ellenőrzés: a szerző és a kapcsolódó könyvek törlődtek
            Assert.IsInstanceOf<NoContentResult>(result);
            Assert.IsNull(await context.Authors.FindAsync(author.Id));
            Assert.IsFalse(context.Books.Any(b => b.AuthorId == author.Id));
        }

    }
}
