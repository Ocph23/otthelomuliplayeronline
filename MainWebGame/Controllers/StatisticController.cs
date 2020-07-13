using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Security.Claims;
using System.Threading.Tasks;
using MainWebGame.Data;
using MainWebGame.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MainWebGame.Controllers {

    [ApiController]
    [Route ("api/[controller]")]
    public class StatisticController : ControllerBase {
        private UserManager<ApplicationUser> _userManager;
        private ScoreModelContext _scoreContext;

        public StatisticController (UserManager<ApplicationUser> userManager, ScoreModelContext scoreContext) {
            _userManager = userManager;
            _scoreContext = scoreContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get (string userId) {
            try {
                var tantangan = _scoreContext.Tantangan.ToList ();
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

        private int getRank (string userid) {
            var users = _userManager.Users.ToList ();
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

            var sorts = listResult.OrderByDescending (x => x.Score).ToArray ();

            var user = sorts.Where (x => x.Id == userid).FirstOrDefault ();
            return Array.IndexOf (sorts, user) + 1;
        }
    }

}