using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace MainWebGame.Data {
    public class ApplicationUser : IdentityUser {
        public string PlayerName { get; set; }
        public byte[] Photo { get; set; }
    }
}