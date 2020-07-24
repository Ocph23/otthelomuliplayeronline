using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using MainWebGame.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace MainWebGame {
    [Authorize (AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    public class GameHub : Hub {
        private static List<UserConnection> connections = new List<UserConnection> ();
        private static List<Game> Games = new List<Game> ();
        private OcphDbContext db;

        public GameHub (OcphDbContext _db) {
            db = _db;

        }

        public async Task InviteOpponent (int userId) {
            try {
                await Task.Delay (1);
                var myId = await Context.User.UserId ();
                var myConnection = connections.Where (x => x.UserId == myId).FirstOrDefault ();
                var oppConnection = connections.Where (x => x.UserId == userId).FirstOrDefault ();

                if (oppConnection.Playing) {
                    throw new SystemException ($"Maaf '{oppConnection.PlayerName}' sedang bermain");
                }

                await Clients.Client (oppConnection.ConnectionId).SendAsync ("OnInvite", myConnection.UserId);

            } catch (System.Exception ex) {

                await Error (400, ex.Message);
            }
        }

        public async Task RejectInvite (int userId) {
            try {
                await Task.Delay (10);
                var myId = await Context.User.UserId ();
                var myConnection = connections.Where (x => x.UserId == myId).FirstOrDefault ();
                var oppConnection = connections.Where (x => x.UserId == userId).FirstOrDefault ();
                await Clients.Client (oppConnection.ConnectionId).SendAsync ("OnRejectInvite", myConnection.UserId);

            } catch (System.Exception ex) {

                await Error (400, ex.Message);
            }
        }

        public async Task WaitResponse () {
            await Task.Delay (10);
        }

        public async Task Join (int userId) {
            try {
                await Task.Delay (1);
                var myId = await Context.User.UserId ();
                var myConnection = connections.Where (x => x.UserId == myId).FirstOrDefault ();
                var oppConnection = connections.Where (x => x.UserId == userId).FirstOrDefault ();

                if (oppConnection.Playing) {
                    throw new SystemException ($"{oppConnection.PlayerName} sedang bermain");
                }
                var game = new Game { Owner = myConnection, Opponent = oppConnection, Tanggal = DateTime.Now };
                Games.Add (game);
                await Start (game);
            } catch (System.Exception ex) {

                await Error (400, ex.Message);
            }
        }

        private async Task Error (int code, string message) {
            var conId = GetConnectionIdByName (Context.User.Identity.Name);
            await Clients.Client (conId).SendAsync ("OnError", code, message);
        }

        private async Task Start (Game game) {
            try {
                await Task.Delay (2000);
                var cons = GetConnectionByGame (game);
                game.Owner.Playing = true;
                game.Opponent.Playing = true;
                await Clients.Client (cons.Item1).SendAsync ("OnStart", game);
                await Clients.Client (cons.Item2).SendAsync ("OnStart", game);

                await Clients.All.SendAsync ("PlayerIsPlay", new UserConnection[] { game.Opponent, game.Owner });

            } catch (Exception ex) {
                await Error (100, ex.Message);
            }
        }

        public async Task Play (string gameId, int n) {
            await Task.Delay (2000);
            var myId = await Context.User.UserId ();
            var game = Games.Where (x => x.GameId == gameId).FirstOrDefault ();
            if (game != null) {
                game.History.Add (new BantuanSolusi { Akhir = n });
                var conns = GetConnectionByGame (game);
                var conId = conns.Item1;
                if (game.Owner.UserId == myId)
                    conId = conns.Item2;
                await Clients.Client (conId).SendAsync ("OnPlay", n);
            }
        }

        public async Task GameOver (Game game) {
            var trans = db.BeginTransaction ();
            try {
                if (game != null)
                    Games.Remove (game);
                var userWin = game.Owner.PlayerName;

                var ownerConnection = connections.Where (x => x.UserId == game.Owner.UserId).FirstOrDefault ();
                ownerConnection.Playing = false;
                var oppConnection = connections.Where (x => x.UserId == game.Opponent.UserId).FirstOrDefault ();
                oppConnection.Playing = false;

                await Task.Delay (300);
                var tantangan = new Tantangan {
                    UserId = game.Owner.UserId, LawanId = game.Opponent.UserId, Tanggal = game.Tanggal,
                };
                var cons = GetConnectionByGame (game);
                await Clients.Client (cons.Item1).SendAsync ("GameOver", game);
                await Clients.Client (cons.Item2).SendAsync ("OnResign", game);

                tantangan.IdTantangan = db.Tantangan.InsertAndGetLastID (tantangan);
                db.Scores.Insert (new HasilBermain {
                    IdTantangan = tantangan.IdTantangan, UserScore = game.Owner.Point,
                        LawanScore = game.Opponent.Point
                });

                var awal = 0;
                foreach (var item in game.History) {
                    item.IdTantangan = tantangan.IdTantangan;
                    item.Awal = awal;
                    db.BantuanSolusi.InsertAndGetLastID (item);
                    awal = item.Akhir;
                }

                trans.Commit ();
            } catch (System.Exception) {
                trans.Rollback ();
            }

        }

        public async Task Resign () {
            await Task.Delay (300);
            var myId = await Context.User.UserId ();
            var game = Games.Where (x => x.Owner.UserId == myId || x.Opponent.UserId == myId).FirstOrDefault ();
            int resign = 1;
            if (game != null) {
                if (game.Opponent.UserId == myId) {
                    resign = -1;
                    game.Opponent.Point = 0;
                } else {
                    game.Owner.Point = 0;
                }
                var cons = GetConnectionByGame (game);
                await Clients.Client (cons.Item1).SendAsync ("OnResign", resign);
                await Clients.Client (cons.Item2).SendAsync ("OnResign", resign);
                await GameOver (game);
            }
        }

        public async Task UpdateGame (string gameId, int ownerPoint, int oppPoint) {
            // await Task.Delay (500);
            // var savedgame = Games.Where (x => x.GameId == gameId).FirstOrDefault ();
            // if (savedgame != null) {
            //     savedgame.Opponent.Point = oppPoint;
            //     savedgame.Owner.Point = ownerPoint;
            // }
        }

        //users Connections

        public override async Task OnConnectedAsync () {

            var userId = await Context.User.UserId ();
            UserConnection user = connections.Where (x => x.UserId == userId).FirstOrDefault ();

            if (user != null) {
                user.ConnectionId = Context.ConnectionId;
            } else {

                var userDb = await Context.User.Profile (db);
                user = new UserConnection { Photo = userDb.Photo, ConnectionId = Context.ConnectionId, UserName = userDb.UserName, PlayerName = userDb.PlayerName, UserId = userDb.IdUser };
                connections.Add (user);
            }

            user.IsOnline = true;
            user.Playing = false;
            await Clients.Others.SendAsync ("OnOnlinePlayer", user);
            await base.OnConnectedAsync ();
        }

        public override async Task OnDisconnectedAsync (Exception exception) {
            var conid = Context.ConnectionId;
            await Resign ();
            var item = connections.Where (x => x.ConnectionId == conid).FirstOrDefault ();
            if (item != null) {
                {
                    connections.Remove (item);
                }
            }
            await Clients.Others.SendAsync ("OnOfflinePlayer", conid);
            await base.OnDisconnectedAsync (exception);
        }
        public async Task GetUsers () {

            await Clients.Client (Context.ConnectionId).SendAsync ("Users", connections);
        }

        private string GetConnectionIdByName (string name) {
            var con = connections.Where (x => x.UserName == name).FirstOrDefault ();
            return con != null ? con.ConnectionId : string.Empty;
        }

        private Tuple<string, string> GetConnectionByGame (Game game) {
            var ownerCon = GetConnectionIdByName (game.Owner.UserName);
            var ooppCon = GetConnectionIdByName (game.Opponent.UserName);
            return Tuple.Create (ownerCon, ooppCon);
        }

    }

    public class UserConnection : PlayerStatus {
        public int UserId { get; set; }
        public string PlayerName { get; set; }
        public string UserName { get; set; }
        public string ConnectionId { get; set; }
        //public ScoreModel Score { get; set; }
        public int Rank { get; set; }
        public int Pion { get; set; }
        public int Point { get; set; }
        public byte[] Photo { get; set; }
    }

    public class Game {
        public string GameId { get; set; } = Guid.NewGuid ().ToString ();
        public UserConnection Opponent { get; set; }
        public UserConnection Owner { get; set; }
        public DateTime Tanggal { get; set; }

        public List<BantuanSolusi> History { get; set; } = new List<BantuanSolusi> ();

    }

    public class PlayerStatus {
        public bool IsOnline { get; set; } = true;
        public bool Playing { get; set; }
        public bool Owner { get; set; }
    }

    public static class GameHubExtention {
        public static Task<User> Profile (this ClaimsPrincipal clime, OcphDbContext db) {
            try {
                var userId = clime.FindFirst (ClaimTypes.NameIdentifier)?.Value;
                if (!string.IsNullOrEmpty (userId)) {
                    int id = Convert.ToInt32 (userId);
                    var user = db.Users.Where (x => x.IdUser == id).FirstOrDefault ();
                    return Task.FromResult (user);

                }
                return null;
            } catch (System.Exception) {

                return null;
            }
        }

        public static Task<int> UserId (this ClaimsPrincipal clime) {
            var userId = clime.FindFirst (ClaimTypes.NameIdentifier)?.Value;
            int id = Convert.ToInt32 (userId);
            if (id > 0)
                return Task.FromResult (id);
            return null;
        }
    }

}