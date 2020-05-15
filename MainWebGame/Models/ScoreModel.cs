using Microsoft.EntityFrameworkCore;

namespace MainWebGame.Models {
    public class ScoreModelContext : DbContext {
        public ScoreModelContext (DbContextOptions<ScoreModelContext> options) : base (options) { }
        public DbSet<ScoreModel> Scores { get; set; }

        protected override void OnModelCreating (ModelBuilder modelBuilder) {
            modelBuilder.Entity<ScoreModel> ().ToTable ("Score");
        }
    }

    public class ScoreModel {

        public int Id { get; set; }
        public string UserId { get; set; }
        public int Score { get; set; }
        public int Win { get; set; }
        public int Lost { get; set; }
        public int Rank { get; set; }
    }
}