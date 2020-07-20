using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using MainWebGame.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace MainWebGame.Services {
    public interface IUserService {
        Task<User> Authenticate (string username, string password);
        //  bool verifyemail (int userid, string token);
        object profile (int userid);
        Task<IEnumerable<dynamic>> GetUsers ();
        Task<User> Register (UserRegister user);
    }

    public class UserService : IUserService {
        private AppSettings _appSettings;
        private OcphDbContext db;

        public UserService (IOptions<AppSettings> appSettings, OcphDbContext _db) {
            _appSettings = appSettings.Value;
            db = _db;

        }

        public async Task<User> Authenticate (string username, string password) {
            try {

                if (db.Users.Select ().Count () <= 0) {
                    await Register (new UserRegister { username = "Admin", email = "admin@gmail.com", password = "Admin", Role = Role.Admin });
                    throw new SystemException ("Anda Tidak Memiliki Akses");
                }

                var user = db.Users.Where (x => x.UserName == username || x.email == username).FirstOrDefault ();
                if (user == null) {
                    throw new SystemException ("Anda Tidak Memiliki Akses");
                }
                if (!Helper.VerifyMd5Hash (password, user.Password))
                    throw new SystemException ("Anda Tidak Memiliki Akses");

                user.Token = user.GenerateToken (_appSettings.Secret);
                return user;

            } catch (System.Exception ex) {
                throw new SystemException (ex.Message);
            }
        }

        public object profile (int userid) {
            // var user = db.Users.Where (x => x.IdUser == userid).FirstOrDefault ();
            return null; //user.profile(db);
        }

        public Task<User> Register (UserRegister userRegister) {
            var transaction = db.BeginTransaction ();
            try {

                var code = new Random ().Next (10000, 99999).ToString ();
                var user = new User {
                    UserName = userRegister.username, PlayerName = userRegister.PlayerName, Password = Helper.GetMd5Hash (userRegister.password),
                    Role = userRegister.Role, email = userRegister.email, status = true
                };
                user = user.CreateUser (db);
                var token = user.GenerateToken (_appSettings.Secret);

                transaction.Commit ();
                return Task.FromResult (user);

            } catch (System.Exception e) {
                transaction.Rollback ();
                var message = e.Message == "Data Duplikat" ? "UserName/Email Sudah Terdaftar" : e.Message;
                throw new SystemException (message);
            }
        }

        public Task<IEnumerable<dynamic>> GetUsers () {
            throw new NotImplementedException ();
        }

    }

    public static class UserExtention {
        public static User CreateUser (this User user, OcphDbContext db) {
            try {
                user.IdUser = db.Users.InsertAndGetLastID (user);
                return user;
            } catch (System.Exception ex) {

                throw new SystemException (ex.Message);
            }
        }

        public static User GetDataUser (this System.Security.Claims.ClaimsPrincipal user, OcphDbContext db) {
            var claim = user.Claims.Where (x => x.Type == ClaimTypes.NameIdentifier).FirstOrDefault ();
            var result = db.Users.Where (x => x.UserName == claim.Value).FirstOrDefault ();
            return result;
        }

        public static string GenerateToken (this User user, string secretCode) {
            var claims = new List<Claim> {
                new Claim (JwtRegisteredClaimNames.Sub, user.IdUser.ToString ()),
                new Claim (JwtRegisteredClaimNames.Sub, user.email),
                new Claim (JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim (JwtRegisteredClaimNames.Jti, Guid.NewGuid ().ToString ()),
                new Claim (ClaimTypes.NameIdentifier, user.IdUser.ToString ())
            };

            var key = new SymmetricSecurityKey (Encoding.UTF8.GetBytes (secretCode));
            var creds = new SigningCredentials (key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays (Convert.ToDouble (7));

            var token = new JwtSecurityToken (
                secretCode,
                secretCode,
                claims,
                expires : expires,
                signingCredentials : creds
            );

            return new JwtSecurityTokenHandler ().WriteToken (token);
        }
    }
}