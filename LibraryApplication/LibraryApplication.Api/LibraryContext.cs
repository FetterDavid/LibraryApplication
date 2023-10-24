using System.Collections.Generic;
using System;
using Microsoft.EntityFrameworkCore;
using LibraryApplication.Contract;

namespace LibraryApplication.Api
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions options)
            : base(options)
        {
        }
        
        public virtual DbSet<Book> Books { get; set; }
        public virtual DbSet<Member> Members { get; set; }
        public virtual DbSet<Borrowing> Borrowings { get; set; }
        public virtual DbSet<Publisher> Publishers { get; set; }
        public virtual DbSet<Author> Authors { get; set; }
        public virtual DbSet<Category> Categories { get; set; }
        public virtual DbSet<Librarian> Librarians { get; set; }
        public virtual DbSet<Rating> Ratings { get; set; }
    }
}
