using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace MainWebGame.Models {
    public class ScoreModelContext : DbContext {
        public ScoreModelContext (DbContextOptions<ScoreModelContext> options) : base (options) { }
        public DbSet<ScoreModel> Scores { get; set; }
        public DbSet<PeraturanModel> Peraturans { get; set; }
        public DbSet<Riwayat> Riwayat { get; set; }
        public DbSet<Tantangan> Tantangan { get; set; }

        protected override void OnModelCreating (ModelBuilder modelBuilder) {
            modelBuilder.Entity<ScoreModel> ().ToTable ("Score");
            modelBuilder.Entity<PeraturanModel> ().ToTable ("Peraturan");
            modelBuilder.Entity<Riwayat> ().ToTable ("Riwayat");
            modelBuilder.Entity<Tantangan> ().ToTable ("Tantangan");
        }
    }

    public class ScoreModel {
        [Key]
        public int Id { get; set; }
        public string UserId { get; set; }
        public int Score { get; set; }
        public int Win { get; set; }
        public int Lost { get; set; }
        public int Rank { get; set; }
    }

    public class Tantangan {
        [Key]
        public int IdTantangan { get; set; }
        public string UserId { get; set; }
        public string LawanId { get; set; }
        public DateTime Tanggal { get; set; }
        public int UserScore { get; set; }
        public int LawanScore { get; set; }
    }

    public class Riwayat {
        [Key]
        public int IdRiwayat { get; set; }

        [ForeignKey (nameof (Tantangan))]
        public string IdTantangan { get; set; }
        public string Awal { get; set; }
        public string Akhir { get; set; }

        public bool Ai { get; set; }
    }

    public class PeraturanModel {
        [Key]
        public int IdPeraturan { get; set; }
        public string Keterangan { get; set; }
    }

}