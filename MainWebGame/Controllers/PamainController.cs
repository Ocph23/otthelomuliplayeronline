using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MainWebGame.Controllers {

    [ApiController]
    [Route ("api/[controller]")]
    public class PemainController : ControllerBase {
        private AppSettings _appSettings;
        private OcphDbContext db;

        public PemainController (IOptions<AppSettings> appSettings, OcphDbContext _db) {
            _appSettings = appSettings.Value;
            db = _db;

        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {
                await Task.Delay (2);
                var result = new List<object> ();
                var users = db.Users.Select ().ToList ();

                return Ok (result);
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete (string id) {
            try {
                await Task.Delay (2);
                var users = db.Users.Select ().ToList ();
                throw new System.Exception ("");
            } catch (System.Exception ex) {
                return BadRequest (ex.Message);
            }
        }

    }
}