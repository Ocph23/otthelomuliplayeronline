using System;
using Ocph.DAL;

namespace MainWebGame.Models {

    [TableName ("Tantangan")]
    public class Tantangan {
        [PrimaryKey ("Id_Tantangan")]
        [DbColumn ("Id_Tantangan")]
        public int IdTantangan { get; set; }

        [DbColumn ("id_pemain")]

        public int UserId { get; set; }

        [DbColumn ("id_lawan")]

        public int LawanId { get; set; }

        [DbColumn ("tanggal")]
        public DateTime Tanggal { get; set; }

    }
}