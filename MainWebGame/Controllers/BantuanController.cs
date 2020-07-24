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
    public class BantuanController : ControllerBase {
        private AppSettings _appSettings;
        private OcphDbContext db;

        public BantuanController (IOptions<AppSettings> appSettings, OcphDbContext _db) {
            _appSettings = appSettings.Value;
            db = _db;

        }

        [HttpGet]
        public async Task<IActionResult> Get (int id) {
            try {
                await Task.Delay (50);
                var result = db.BantuanSolusi.Where (x => x.IdTantangan == id);
                return Ok (result.ToList ());
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

    }
}