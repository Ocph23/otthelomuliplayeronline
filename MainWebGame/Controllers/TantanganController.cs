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
    public class TantanganController : ControllerBase {
        private UserManager<ApplicationUser> _userManager;
        private ScoreModelContext _scoreContext;

        public TantanganController (UserManager<ApplicationUser> userManager, ScoreModelContext scoreContext) {
            _userManager = userManager;
            _scoreContext = scoreContext;
        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {

                var users = _userManager.Users.ToList ();
                var tantangan = _scoreContext.Tantangan.ToList ();

                var result = from a in tantangan
                join b in users on a.UserId equals b.Id
                join c in users on a.LawanId equals c.Id
                select new { UserScore = a.UserScore, LawanScore = a.LawanScore, Tanggal = a.Tanggal, Idtantangan = a.IdTantangan, User1 = b.PlayerName, User2 = c.PlayerName, Winner = a.UserScore >= a.LawanScore?b.PlayerName : c.PlayerName };

                return Ok (result);
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

    }
}