using System.Collections.Generic;
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
    public class PemainController : ControllerBase {
        private UserManager<ApplicationUser> _userManager;

        public PemainController (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {
                var result = new List<object> ();
                var users = _userManager.Users.ToList ();
                foreach (var item in users) {
                    if (!await _userManager.IsInRoleAsync (item, "Admin"))
                        result.Add (new { Id = item.Id, Email = item.Email, PlayerName = item.PlayerName });

                }
                return Ok (result);
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> Delete (string id) {
            try {
                var user = await _userManager.FindByIdAsync (id);
                var result = await _userManager.DeleteAsync (user);
                if (result.Succeeded) {
                    return Ok (true);
                }
                throw new System.Exception ("");
            } catch (System.Exception ex) {
                return BadRequest (ex.Message);
            }
        }

    }
}