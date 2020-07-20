using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using MainWebGame.Models;
using Microsoft.Extensions.Options;
using Ocph.DAL.Provider.MySql;
using Ocph.DAL.Repository;

namespace MainWebGame {

    public class OcphDbContext : MySqlDbConnection, IDisposable {
        public OcphDbContext (IOptions<AppSettings> setting) {
            this.ConnectionString = setting.Value.ConnectionString;
        }

        public OcphDbContext (string constring) {
            this.ConnectionString = constring;
        }

        public IRepository<User> Users { get { return new Repository<User> (this); } }
        public IRepository<Tantangan> Tantangan { get { return new Repository<Tantangan> (this); } }
        public IRepository<BantuanSolusi> BantuanSolusi { get { return new Repository<BantuanSolusi> (this); } }
        public IRepository<PeraturanModel> Peraturan { get { return new Repository<PeraturanModel> (this); } }

        public IEnumerable<dynamic> SelectDynamic (string sql) {

            var command = this.CreateCommand ();
            command.CommandText = sql;
            command.CommandType = System.Data.CommandType.Text;
            using (var reader = command.ExecuteReader ()) {
                var names = Enumerable.Range (0, reader.FieldCount).Select (reader.GetName).ToList ();
                foreach (IDataRecord record in reader as IEnumerable) {
                    var expando = new Dictionary<string, object> ();
                    foreach (var name in names)
                        expando[name] = record[name];

                    yield return expando;
                }
            }

        }

    }
}