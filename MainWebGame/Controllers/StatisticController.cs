using System;
using System.Collections.Generic;
using System.Globalization;
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
    public class StatisticController : ControllerBase {
        private AppSettings _appSettings;
        private OcphDbContext db;

        public StatisticController(IOptions<AppSettings> appSettings, OcphDbContext _db)
        {
            _appSettings = appSettings.Value;
            db = _db;

        }

        [HttpGet]
        public async Task<IActionResult> Get (int userId) {
            try {
                var tantangan = db.Tantangan.Select().ToList ();
                var data = tantangan.Where (x => x.UserId == userId || x.LawanId == userId);
                var results = from a in data select new PlayerScore {
                    Tanggal = a.Tanggal,
                    Score = a.UserId == userId ? a.UserScore : a.LawanScore,
                    Win = a.UserId == userId && a.UserScore > a.LawanScore ? true : a.LawanId == userId && a.LawanScore > a.UserScore?true : false
                };

                var resume = new { Score = results.Sum (x => x.Score), Rank = getRank (userId), Games = results.Count (), Win = results.Where (x => x.Win).Count () };

                var groups = results.GroupBy (x => new { x.Tanggal.Month, x.Tanggal.Year });

                List<object> list = new List<object> ();
                foreach (var item in groups) {
                    list.Add (new {
                        Label = new DateTime (2010, item.Key.Month, 1)
                            .ToString ("MMM", CultureInfo.InvariantCulture) + " " + item.Key.Year, Score = item.Sum (x => x.Score)
                    });
                }
                return Ok (new { Resume = resume, Data = list });
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

        private int getRank (int userid) {
            var users = db.Users.Select().ToList ();
            var tantangan = db.Tantangan.Select().ToList ();
            var listResult = new List<PlayerScore> ();
            foreach (var item in users) {
                var data = tantangan.Where (x => x.UserId == item.IdUser || x.LawanId == item.IdUser);
                var results = from a in data select new {
                    Score = a.UserId == item.IdUser?a.UserScore : a.LawanScore
                };

                if (item.PlayerName!=null && item.PlayerName.ToLower () != "admin")
                    listResult.Add (new PlayerScore { Id = item.IdUser, PlayerName = item.PlayerName, Score = results.Sum (x => x.Score) });
            }

            var sorts = listResult.OrderByDescending (x => x.Score).ToArray ();

            var user = sorts.Where (x => x.Id == userid).FirstOrDefault ();
            return Array.IndexOf (sorts, user) + 1;
        }
    }

}