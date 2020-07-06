using System.Collections.Generic;
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
    public class PeringkatController : ControllerBase {
        private UserManager<ApplicationUser> _userManager;
        private ScoreModelContext _scoreContext;

        public PeringkatController (UserManager<ApplicationUser> userManager, ScoreModelContext scoreContext) {
            _userManager = userManager;
            _scoreContext = scoreContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {
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

                return Ok (listResult.OrderByDescending (x => x.Score));
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

    }

    public class PlayerScore {
        public string Id { get; set; }
        public string PlayerName { get; set; }
        public int Score { get; set; }
    }
}