using Ocph.DAL;

namespace MainWebGame.Models {

    [TableName ("Peraturan")]

    public class PeraturanModel {

        [PrimaryKey ("IdPeraturan")]
        [DbColumn ("IdPeraturan")]

        public int IdPeraturan { get; set; }

        [DbColumn ("Keterangan")]
        public string Keterangan { get; set; }
    }

}