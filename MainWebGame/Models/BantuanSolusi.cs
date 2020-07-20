using Ocph.DAL;

namespace MainWebGame.Models {
    [TableName ("BantuanSolusi")]
    public class BantuanSolusi {

        [PrimaryKey ("idsolusi")]
        [DbColumn ("idsolusi")]
        public int IdSolusi { get; set; }

        [DbColumn ("id_tantangan")]
        public int IdTantangan { get; set; }

        [DbColumn ("awal")]
        public int Awal { get; set; }

        [DbColumn ("akhir")]
        public int Akhir { get; set; }

        [DbColumn ("solusi")]
        public bool Solusi { get; set; }
    }

}