using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Ocph.DAL;

namespace MainWebGame.Models {
  [TableName ("Admin")]
  public class Admin {
    [PrimaryKey ("idusers")]
    [DbColumn ("idusers")]
    public int IdUser { get; set; }

    [DbColumn ("username")]
    public string UserName { get; set; }

    public string PlayerName { get; set; }

    [DbColumn ("password")]
    public string Password { get; set; }

    public Role Role { get; set; }

    public string Token { get; set; }

  }

}