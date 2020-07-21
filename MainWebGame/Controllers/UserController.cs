using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MainWebGame.Models;
using MainWebGame.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace MainWebGame.Controllers {

    [ApiController]
    [Route ("api/[controller]/[action]")]
    public class UserController : ControllerBase {
        private OcphDbContext db;
        private IUserService _userService;

        public UserController (OcphDbContext _db, IUserService service) {
            db = _db;
            _userService = service;

        }

        [HttpPost]
        public async Task<IActionResult> login (UserLogin user) {
            try {

                var result = await _userService.Authenticate (user.UserName, user.Password);
                return Ok (result);
            } catch (System.Exception ex) {
                return BadRequest (ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> register (UserRegister user) {
            try {
                var result = await _userService.Register (user);
                return Ok (result);
            } catch (System.Exception ex) {
                return BadRequest (ex.Message);
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> profile () {
            try {
                await Task.Delay (1);
                var user = User.Profile (db);
                if (user != null)
                    return Ok (user);

                throw new System.Exception ("Data Profile Anda Tidak Ditemukan");
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> photo (User user) {
            try {
                await Task.Delay (1);
                var updated = db.Users.Update (x => new { x.Photo }, user, x => x.IdUser == user.IdUser);
                if (updated)
                    return Ok (true);

                throw new System.Exception ("Data Profile Anda Tidak Ditemukan");
            } catch (System.Exception ex) {

                return BadRequest (ex.Message);
            }
        }

    }
}