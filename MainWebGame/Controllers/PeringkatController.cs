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

        public PeringkatController(IOptions<AppSettings> appSettings, OcphDbContext _db)
        {
            _appSettings = appSettings.Value;
            db = _db;

        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {
                /* var users = _userManager.Users.ToList ();
                 var tantangan = _scoreContext.Tantangan.ToList ();
                 var listResult = new List<PlayerScore> ();
                 foreach (var item in users) {
                     var data = tantangan.Where (x => x.UserId == item.Id || x.LawanId == item.Id);
                     var results = from a in data select new {
                         Score = a.UserId == item.Id?a.UserScore : a.LawanScore
                     };

                     if (item.PlayerName.ToLower () != "admin")
                         listResult.Add (new PlayerScore { Id = item.Id, PlayerName = item.PlayerName, Score = results.Sum (x => x.Score) });
                 }
                 */
                return Ok();
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

        // [HttpGet]
        // [Route ("api/[controller]/[action]")]
        // public async Task<IActionResult> GetById (string userId) {
        //     try {
        //         var tantangan = _scoreContext.Tantangan.ToList ();
        //         var data = tantangan.Where (x => x.UserId == userId || x.LawanId == userId);
        //         var results = from a in data select new PlayerScore {
        //             Tanggal = a.Tanggal,
        //             Score = a.UserId == userId ? a.UserScore : a.LawanScore
        //         };

        //         var groups = results.GroupBy (x => new { x.Tanggal.Month, x.Tanggal.Year });

        //         return Ok (groups);
        //     } catch (System.Exception ex) {

        //         return BadRequest (ex.Message);
        //     }
        // }

    }

    public class PlayerScore {
        public int Id { get; set; }
        public string PlayerName { get; set; }
        public int Score { get; set; }
        public DateTime Tanggal { get; set; }
        public bool Win { get; internal set; }
    }
}