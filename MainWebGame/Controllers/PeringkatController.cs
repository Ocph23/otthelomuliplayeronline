using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Security.Claims;
using System.Threading.Tasks;
using MainWebGame.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MainWebGame.Controllers {

    [ApiController]
    [Route ("api/[controller]")]
    public class PeringkatController : ControllerBase {
        private AppSettings _appSettings;
        private OcphDbContext db;

        public PeringkatController (IOptions<AppSettings> appSettings, OcphDbContext _db) {
            _appSettings = appSettings.Value;
            db = _db;

        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {
                var users = db.Users.Select ().ToList ();
                var tantangan = db.Tantangan.Select ().ToList ();
                var listResult = new List<PlayerScore> ();
                foreach (var item in users) {
                    var data = from a in tantangan.Where (x => x.UserId == item.IdUser || x.LawanId == item.IdUser)
                    join b in db.Scores.Select () on a.IdTantangan equals b.IdTantangan
                    select new {
                        Score = a.UserId == item.IdUser?b.UserScore : b.LawanScore
                    };

                    if (item.PlayerName.ToLower () != "admin")
                        listResult.Add (new PlayerScore { Id = item.IdUser, PlayerName = item.PlayerName, Score = data.Sum (x => x.Score) });
                }
                return Ok (listResult);
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

    }

    public class PlayerScore {
        public int Id { get; set; }
        public string PlayerName { get; set; }
        public int Score { get; set; }
        public DateTime Tanggal { get; set; }
        public bool Win { get; internal set; }
    }
}