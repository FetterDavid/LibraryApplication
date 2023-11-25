using LibraryApplication.Contract.TestModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Threading.Tasks;

namespace LibraryApplication.Api.UnitTests.Controllers
{
    [TestFixture]
    public class TestEntityControllerTests
    {
        private LibraryContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<LibraryContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new LibraryContext(options);
        }

        [Test]
        public async Task Post_ShouldAddEntity()
        {
            using var context = GetInMemoryDbContext();
            var controller = new TestEntityController(context);
            var entity = new TestEntity();
            var result = await controller.Post(entity);
            Assert.IsInstanceOf<OkResult>(result);
            Assert.AreEqual(1, context.Set<TestEntity>().Count());
        }

        [Test]
        public async Task Delete_ShouldRemoveEntity()
        {
            using var context = GetInMemoryDbContext();
            var controller = new TestEntityController(context);
            var entity = new TestEntity();
            context.Set<TestEntity>().Add(entity);
            await context.SaveChangesAsync();
            var result = await controller.Delete(entity.Id);
            Assert.IsInstanceOf<NoContentResult>(result);
            Assert.AreEqual(0, context.Set<TestEntity>().Count());
        }

        [Test]
        public async Task Get_ReturnsAllEntities()
        {
            using var context = GetInMemoryDbContext();
            var controller = new TestEntityController(context);
            // Entitások hozzáadása a kontextushoz
            context.Set<TestEntity>().AddRange(new TestEntity(), new TestEntity());
            await context.SaveChangesAsync();
            var actionResult = await controller.Get();
            // Ellenőrizd, hogy az eredmény OkObjectResult típusú-e
            Assert.IsInstanceOf<OkObjectResult>(actionResult.Result);
            // Kinyerjük a tényleges entitás listát
            var okResult = actionResult.Result as OkObjectResult;
            var entities = okResult.Value as IEnumerable<TestEntity>;
            Assert.AreEqual(2, entities.Count());
        }


        [Test]
        public async Task GetById_ExistingId_ReturnsEntity()
        {
            using var context = GetInMemoryDbContext();
            var controller = new TestEntityController(context);
            var newEntity = new TestEntity();
            context.Set<TestEntity>().Add(newEntity);
            await context.SaveChangesAsync();
            var result = await controller.GetById(newEntity.Id);
            var okResult = result.Result as OkObjectResult;
            Assert.IsNotNull(okResult);
            var entity = okResult.Value as TestEntity;
            Assert.AreEqual(newEntity.Id, entity.Id);
        }

        [Test]
        public async Task GetById_NonExistingId_ReturnsNotFound()
        {
            using var context = GetInMemoryDbContext();
            var controller = new TestEntityController(context);
            var result = await controller.GetById(9999); // Egy nem létező ID
            Assert.IsInstanceOf<NotFoundResult>(result.Result);
        }

        [Test]
        public async Task Update_NonExistingId_ReturnsNotFound()
        {
            using var context = GetInMemoryDbContext();
            var controller = new TestEntityController(context);
            var updatedEntity = new TestEntity();
            var result = await controller.Update(999, updatedEntity); // Egy nem létező ID
            Assert.IsInstanceOf<NotFoundResult>(result);
        }

    }
}
