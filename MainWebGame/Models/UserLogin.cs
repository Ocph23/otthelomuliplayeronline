namespace MainWebGame.Models {
    public class UserLogin {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class UserRegister {
        public string username { get; set; }

        public string email { get; set; }
        public string PlayerName { get; set; }

        public string password { get; set; }

        public Role Role { get; set; }

    }
}