using LibraryApplication.Api.Controllers;
using LibraryApplication.Contract.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;

namespace LibraryApplication.Api.UnitTests.Controllers
{
    public class CategoryControllerTest
    {
        private LibraryContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new LibraryContext(options);
        }

        [Test]
        public async Task DeepDeleteCategoryById_ExistingId_DeletesCategoryAndRelatedBooks()
        {
            using var context = GetInMemoryDbContext();
            var controller = new CategoryController(context);
            // Tesztadatok: Kategória és kapcsolódó könyvek létrehozása
            var category = new Category { Name = "Test Category" };
            context.Categories.Add(category);
            await context.SaveChangesAsync();
            var book1 = new Book { Title = "Book 1", CategoryId = category.Id };
            var book2 = new Book { Title = "Book 2", CategoryId = category.Id };
            context.Books.AddRange(book1, book2);
            await context.SaveChangesAsync();
            // Metódus hívása a kategória azonosítójával
            var result = await controller.DeepDeleteCategoryById(category.Id);
            // Ellenőrzés: a kategória és a kapcsolódó könyvek törlődtek
            Assert.IsInstanceOf<NoContentResult>(result);
            Assert.IsNull(await context.Categories.FindAsync(category.Id));
            Assert.IsFalse(context.Books.Any(b => b.CategoryId == category.Id));
        }

    }
}
