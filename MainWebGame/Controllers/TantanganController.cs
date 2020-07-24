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
    public class TantanganController : ControllerBase {
        private AppSettings _appSettings;
        private OcphDbContext db;

        public TantanganController (IOptions<AppSettings> appSettings, OcphDbContext _db) {
            _appSettings = appSettings.Value;
            db = _db;

        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {
                await Task.Delay (50);
                var users = db.Users.Select ().Where (x => x.Role != Role.Admin).ToList ();
                var tantangan = db.Tantangan.Select ();

                var result = from a in tantangan
                join d in db.Scores.Select () on a.IdTantangan equals d.IdTantangan
                join b in users on a.UserId equals b.IdUser
                join c in users on a.LawanId equals c.IdUser
                select new {
                    IdUser = a.UserId, IdLawan = a.LawanId, UserScore = d.UserScore, LawanScore = d.LawanScore, Tanggal = a.Tanggal,
                    Idtantangan = a.IdTantangan, User1 = b.PlayerName, User2 = c.PlayerName,
                    Winner = d.UserScore >= d.LawanScore?b.PlayerName : c.PlayerName
                };

                return Ok (result.ToList ());
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

    }
}