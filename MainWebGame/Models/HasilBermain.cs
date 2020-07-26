using Ocph.DAL;

namespace MainWebGame.Models {
    [TableName ("hasil_bermain")]
    public class HasilBermain {

        [DbColumn ("idtantangan")]
        public int IdTantangan { get; set; }

        [DbColumn ("skor_pemain")]
        public int UserScore { get; set; }

        [DbColumn ("skor_lawan")]
        public int LawanScore { get; set; }

    }

}