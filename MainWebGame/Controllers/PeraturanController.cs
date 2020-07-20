using System.Linq;
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
    public class PeraturanController : ControllerBase {
        private AppSettings _appSettings;
        private OcphDbContext db;

        public PeraturanController (IOptions<AppSettings> appSettings, OcphDbContext _db) {
            _appSettings = appSettings.Value;
            db = _db;

        }

        [Authorize]
        [HttpGet]
        public async Task<IActionResult> Get () {
            string userId = User.FindFirst (ClaimTypes.NameIdentifier).Value;
            await Task.Delay (1);
            var result = db.Peraturan.Select ().ToList ();
            return Ok (result);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Post (PeraturanModel model) {
            try {
                await Task.Delay (1);
                model.IdPeraturan = db.Peraturan.InsertAndGetLastID (model);
                return Ok (model);
            } catch (System.Exception ex) {
                return BadRequest (ex.Message);
            }
        }

        [Authorize]
        [HttpPut]
        public async Task<IActionResult> Put (PeraturanModel model) {
            await Task.Delay (1);
            try {
                var updated = db.Peraturan.Update (x => new { x.Keterangan }, model, x => x.IdPeraturan == model.IdPeraturan);
                if (updated) {
                    return Ok (model);
                } else {
                    throw new System.Exception ("Tidak Berhasil DIubah");
                }
            } catch (System.Exception ex) {
                return BadRequest (ex.Message);
            }

        }

        [Authorize]
        [HttpDelete]
        public async Task<IActionResult> Delete (int id) {
            try {
                await Task.Delay (1);
                if (db.Peraturan.Delete (x => x.IdPeraturan == id))
                    return Ok (true);
                else {
                    throw new System.Exception ("Tidak Berhasil Dihapus");
                }
            } catch (System.Exception ex) {
                return BadRequest (ex.Message);
            }
        }

    }
}