using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MainWebGame.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MainWebGame.Controllers {

    [ApiController]
    [Route ("api/[controller]/[action]")]
    public class UserController : ControllerBase {
        private UserManager<ApplicationUser> _userManager;

        public UserController (UserManager<ApplicationUser> userManager) {
            _userManager = userManager;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> profile () {
            var userId = User.FindFirstValue (ClaimTypes.NameIdentifier); // will give the user's userId
            var userName = User.FindFirstValue (ClaimTypes.Name); // will give the user's userName

            ApplicationUser applicationUser = await _userManager.GetUserAsync (User);
            if (applicationUser != null)
                return Ok (new { Id = applicationUser.Id, UserName = applicationUser.UserName, PlayerName = applicationUser.PlayerName, Photo = applicationUser.Photo });
            else return Ok (null);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> photo (ApplicationUser user) {
            ApplicationUser applicationUser = await _userManager.FindByIdAsync (user.Id);
            if (applicationUser != null) {
                applicationUser.Photo = user.Photo;
                var result = await _userManager.UpdateAsync (applicationUser);
            }
            return Ok (true);
        }

    }
}