using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace MainWebGame.Migrations {
    public partial class InitialCreate : Migration {
        protected override void Up (MigrationBuilder migrationBuilder) {
            migrationBuilder.CreateTable (
                name: "Peraturan",
                columns : table => new {
                    IdPeraturan = table.Column<int> (nullable: false)
                        .Annotation ("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                        Keterangan = table.Column<string> (nullable: true)
                },
                constraints : table => {
                    table.PrimaryKey ("PK_Peraturan", x => x.IdPeraturan);
                });

            migrationBuilder.CreateTable (
                name: "Riwayat",
                columns : table => new {
                    IdRiwayat = table.Column<int> (nullable: false)
                        .Annotation ("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                        IdTantangan = table.Column<string> (nullable: true),
                        Awal = table.Column<string> (nullable: true),
                        Akhir = table.Column<string> (nullable: true),
                        Ai = table.Column<bool> (nullable: false)
                },
                constraints : table => {
                    table.PrimaryKey ("PK_Riwayat", x => x.IdRiwayat);
                });

            migrationBuilder.CreateTable (
                name: "Score",
                columns : table => new {
                    Id = table.Column<int> (nullable: false)
                        .Annotation ("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                        UserId = table.Column<string> (nullable: true),
                        Score = table.Column<int> (nullable: false),
                        Win = table.Column<int> (nullable: false),
                        Lost = table.Column<int> (nullable: false),
                        Rank = table.Column<int> (nullable: false)
                },
                constraints : table => {
                    table.PrimaryKey ("PK_Score", x => x.Id);
                });

            migrationBuilder.CreateTable (
                name: "Tantangan",
                columns : table => new {
                    IdTantangan = table.Column<int> (nullable: false)
                        .Annotation ("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                        UserId = table.Column<string> (nullable: true),
                        LawanId = table.Column<string> (nullable: true),
                        Tanggal = table.Column<DateTime> (nullable: false),
                        UserScore = table.Column<int> (nullable: false),
                        LawanScore = table.Column<int> (nullable: false)
                },
                constraints : table => {
                    table.PrimaryKey ("PK_Tantangan", x => x.IdTantangan);
                });
        }

        protected override void Down (MigrationBuilder migrationBuilder) {
            migrationBuilder.DropTable (
                name: "Peraturan");

            migrationBuilder.DropTable (
                name: "Riwayat");

            migrationBuilder.DropTable (
                name: "Score");

            migrationBuilder.DropTable (
                name: "Tantangan");
        }
    }
}