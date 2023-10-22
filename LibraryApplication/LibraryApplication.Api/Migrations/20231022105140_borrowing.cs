using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LibraryApplication.Api.Migrations
{
    public partial class borrowing : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ISBN",
                table: "Books");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Members",
                newName: "ReaderNumber");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "Books",
                newName: "InventoryNumber");

            migrationBuilder.CreateTable(
                name: "Borrowings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReaderNumber = table.Column<int>(type: "int", nullable: false),
                    InventoryNumber = table.Column<int>(type: "int", nullable: false),
                    LateFee = table.Column<int>(type: "int", nullable: false),
                    BorrowDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Borrowings", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Borrowings");

            migrationBuilder.RenameColumn(
                name: "ReaderNumber",
                table: "Members",
                newName: "Id");

            migrationBuilder.RenameColumn(
                name: "InventoryNumber",
                table: "Books",
                newName: "Id");

            migrationBuilder.AddColumn<string>(
                name: "ISBN",
                table: "Books",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
