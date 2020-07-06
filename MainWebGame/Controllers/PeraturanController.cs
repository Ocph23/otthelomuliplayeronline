using System.Linq;
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
    public class PeraturanController : ControllerBase {
        private ScoreModelContext _scoreContext;
        private UserManager<ApplicationUser> _userManager;

        public PeraturanController (ScoreModelContext scoreContext, UserManager<ApplicationUser> userManager) {
            _scoreContext = scoreContext;
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            var result = _scoreContext.Peraturans.ToList ();
            return Ok (result);
        }

        [HttpPost]
        public async Task<IActionResult> Post (PeraturanModel model) {
            var result = _scoreContext.Peraturans.Add (model);
            _scoreContext.SaveChanges ();
            return Ok (model);
        }

        [HttpPut]
        public async Task<IActionResult> Put (PeraturanModel model) {
            var result = _scoreContext.Peraturans.Where (x => x.IdPeraturan == model.IdPeraturan).FirstOrDefault ();
            if (result != null) {
                result.Keterangan = model.Keterangan;
                _scoreContext.SaveChanges ();
            }
            return Ok (model);
        }

        [HttpDelete]
        public async Task<IActionResult> Delete (int id) {
            var result = _scoreContext.Peraturans.Where (x => x.IdPeraturan == id).FirstOrDefault ();
            if (result != null) {
                _scoreContext.Peraturans.Remove (result);
                _scoreContext.SaveChanges ();
            }
            return Ok (true);
        }

    }
}