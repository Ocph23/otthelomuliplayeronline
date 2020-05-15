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
        [Route ("profile")]
        [Authorize]
        public async Task<IActionResult> profile () {
            var userId = User.FindFirstValue (ClaimTypes.NameIdentifier); // will give the user's userId
            var userName = User.FindFirstValue (ClaimTypes.Name); // will give the user's userName

            ApplicationUser applicationUser = await _userManager.GetUserAsync (User);
            if (applicationUser != null)
                return Ok (new { Id = applicationUser.Id, UserName = applicationUser.UserName, PlayerName = applicationUser.PlayerName });
            else return Ok (null);
        }

    }
}