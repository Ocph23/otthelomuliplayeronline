using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace MainWebGame.Pages.Game {
    [Authorize (Roles = "Player")]
    public class indexModel : PageModel {
        public void OnGet () { }
    }
}