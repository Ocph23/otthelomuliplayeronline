namespace MainWebGame.Models {
    public class UserLogin {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class UserRegister {

        public string username { get; set; }

        public string PlayerName { get; set; }

        public string Password { get; set; }

        public Role Role { get; set; }

        public byte[] Photo { get; set; }

    }
}