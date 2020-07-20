using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Ocph.DAL;

namespace MainWebGame.Models {
  [TableName ("Pemain")]
  public class User {
    [PrimaryKey ("id_pemain")]
    [DbColumn ("id_pemain")]
    public int IdUser { get; set; }

    [DbColumn ("username")]
    public string UserName { get; set; }

    [DbColumn ("nama_pemain")]
    public string PlayerName { get; set; }

    [DbColumn ("password")]
    public string Password { get; set; }

    [DbColumn ("role")]
    public Role Role { get; set; }

    [DbColumn ("email")]
    public string email { get; set; }

    [DbColumn ("photo")]
    public byte[] Photo { get; set; }

    [DbColumn ("konfirmasi_email")]
    public bool status { get; set; }

    public string Token { get; set; }

  }

  [JsonConverter (typeof (StringEnumConverter))]
  public enum Role {
    Player,
    Admin
  }

}