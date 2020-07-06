using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MainWebGame.Data;
using MainWebGame.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace MainWebGame {
    public class GameHub : Hub {
        private static List<UserConnection> connections = new List<UserConnection> ();
        private static List<Game> Games = new List<Game> ();
        private ScoreModelContext _scoreContext;
        private UserManager<ApplicationUser> _userManager;

        public GameHub (ScoreModelContext scoreContext, UserManager<ApplicationUser> userManager) {
            _scoreContext = scoreContext;
            _userManager = userManager;
        }

        public async Task InviteOpponent (string userId) {
            try {
                await Task.Delay (1);
                var myname = Context.User.Identity.Name;
                var myConnection = connections.Where (x => x.UserName == myname).FirstOrDefault ();
                var oppConnection = connections.Where (x => x.UserId == userId).FirstOrDefault ();

                if (oppConnection.Playing) {
                    throw new SystemException ($"Maaf '{oppConnection.PlayerName}' sedang bermain");
                }

                await Clients.Client (oppConnection.ConnectionId).SendAsync ("OnInvite", myConnection.UserId);

            } catch (System.Exception ex) {

                await Error (400, ex.Message);
            }
        }

        public async Task WaitResponse () {
            await Task.Delay (10);
        }

        public async Task Join (string userId) {
            try {
                await Task.Delay (200);
                var myname = Context.User.Identity.Name;
                var myConnection = connections.Where (x => x.UserName == myname).FirstOrDefault ();
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
            var name = Context.User.Identity.Name;
            var game = Games.Where (x => x.GameId == gameId).FirstOrDefault ();
            if (game != null) {
                var conns = GetConnectionByGame (game);
                var conId = conns.Item1;
                if (game.Owner.UserName == name)
                    conId = conns.Item2;
                await Clients.Client (conId).SendAsync ("OnPlay", n);
            }
        }

        public async Task GameOver (Game game) {
            var name = Context.User.Identity.Name;
            if (game != null)
                Games.Remove (game);
            await Task.Delay (100);
            var userWin = game.Owner.PlayerName;

            var tantangan = new Tantangan {
                UserId = game.Owner.UserId, LawanId = game.Opponent.UserId, Tanggal = game.Tanggal,
                UserScore = game.Owner.Point, LawanScore = game.Opponent.Point
            };
            _scoreContext.Tantangan.Add (tantangan);

            await _scoreContext.SaveChangesAsync ();
            updateRank ();
        }

        public async Task Resign () {
            var name = Context.User.Identity.Name;
            var game = Games.Where (x => x.Owner.UserName == name || x.Opponent.UserName == name).FirstOrDefault ();
            int resign = 1;
            if (game != null) {
                if (game.Opponent.UserName == name)
                    resign = -1;
                var cons = GetConnectionByGame (game);
                await Clients.Client (cons.Item1).SendAsync ("OnResign", resign);
                await Clients.Client (cons.Item2).SendAsync ("OnResign", resign);
                Games.Remove (game);
                //update database here
            }
        }

        //users Connections
        public override async Task OnConnectedAsync () {
            var userDb = await _userManager.GetUserAsync (Context.User);

            UserConnection user = connections.Where (x => x.UserId == userDb.Id).FirstOrDefault ();
            if (user != null) {
                user.ConnectionId = Context.ConnectionId;
            } else {
                user = new UserConnection { Photo = userDb.Photo, ConnectionId = Context.ConnectionId, UserName = userDb.UserName, PlayerName = userDb.PlayerName, UserId = userDb.Id };
                // user.Score = _scoreContext.Scores.Where (x => x.UserId == userDb.Id).FirstOrDefault ();
                // if (user.Score == null) {
                //     user.Score = new ScoreModel { Lost = 0, Score = 0, UserId = userDb.Id, Win = 0 };
                //     _scoreContext.Add (user.Score);
                //     _scoreContext.SaveChanges ();
                // }

                connections.Add (user);
            }

            user.IsOnline = true;
            await Clients.Others.SendAsync ("OnOnlinePlayer", user);
            await base.OnConnectedAsync ();
        }

        public override Task OnDisconnectedAsync (Exception exception) {
            var conid = Context.ConnectionId;
            Resign ();
            var item = connections.Where (x => x.ConnectionId == conid).FirstOrDefault ();
            if (item != null) {
                connections.Remove (item);
            }
            Clients.Others.SendAsync ("OnOfflinePlayer", conid);
            return base.OnDisconnectedAsync (exception);
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

        private void updateRank () {
            var users = _scoreContext.Scores.Where (x => x.Score > 0).OrderByDescending (x => x.Score);
            int rank = 1;
            foreach (var item in users) {
                item.Rank = rank;
                rank++;
            }
            _scoreContext.SaveChangesAsync ();
        }
    }

    public class UserConnection : PlayerStatus {
        public string UserId { get; set; }
        public string PlayerName { get; set; }
        public string UserName { get; set; }
        public string ConnectionId { get; set; }
        public ScoreModel Score { get; set; }
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
    }

    public class PlayerStatus {
        public bool IsOnline { get; set; } = true;
        public bool Playing { get; set; }
        public bool Owner { get; set; }
    }

}