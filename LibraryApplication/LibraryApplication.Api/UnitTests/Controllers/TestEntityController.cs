using LibraryApplication.Api.Controllers;
using LibraryApplication.Contract.TestModels;

namespace LibraryApplication.Api.UnitTests.Controllers
{
    public class TestEntityController : LibraryControllerBase<TestEntity>
    {
        public TestEntityController(LibraryContext context) : base(context) { }
    }

}
