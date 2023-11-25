using System.Collections.Generic;
using System;
using Microsoft.EntityFrameworkCore;
using LibraryApplication.Contract.Models;

namespace LibraryApplication.Api
{
    /// <summary>
    /// A DbContext osztály, amely a könyvtári alkalmazás adatbázis kontextusát kezeli.
    /// Ez az osztály az Entity Framework Core-t használja az adatbázis-entitások kezelésére.
    /// </summary>
    public class LibraryContext : DbContext
    {
        /// <summary>
        /// Inicializál egy új példányt a <see cref="LibraryContext"/> osztályból a megadott opciókkal.
        /// </summary>
        /// <param name="options">A DbContext konfigurációs opciói.</param>
        public LibraryContext(DbContextOptions options)
            : base(options)
        {
        }
        /// <summary>
        /// A könyvek tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Book> Books { get; set; }
        /// <summary>
        /// A tagok tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Member> Members { get; set; }
        /// <summary>
        /// A kölcsönzések tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Borrowing> Borrowings { get; set; }
        /// <summary>
        /// A kiadók tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Publisher> Publishers { get; set; }
        /// <summary>
        /// A szerzők tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Author> Authors { get; set; }
        /// <summary>
        /// A kategóriák tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Category> Categories { get; set; }
        /// <summary>
        /// A könyvtárosok tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Librarian> Librarians { get; set; }
        /// <summary>
        /// A értékelések tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<Rating> Ratings { get; set; }
        /// <summary>
        /// A késedelmidíjaK tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<LateFee> LateFees { get; set; }
        /// <summary>
        /// A könyvbeszerzések tábláját reprezentálja.
        /// </summary>
        public virtual DbSet<BookAcquisition> BookAcquisitions { get; set; }
    }
}
