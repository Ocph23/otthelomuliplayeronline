using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MainWebGame.Data
{
    public class ApplicationUser:IdentityUser
    {
        public string PlayerName { get; set; }
    }
}
