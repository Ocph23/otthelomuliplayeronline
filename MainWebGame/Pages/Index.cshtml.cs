using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;

namespace MainWebGame.Pages {
    public class IndexModel : PageModel {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel (ILogger<IndexModel> logger) {
            _logger = logger;
        }

        public IActionResult OnGet () {
            if (User.IsInRole ("Admin")) {
                return new RedirectToPageResult ("/Admin/index");
            }
            return Page ();
        }
    }
}