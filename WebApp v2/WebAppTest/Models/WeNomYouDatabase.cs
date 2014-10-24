using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebAppTest.Models
{
    public class WeNomYouDatabase: DbContext
    {
        public WeNomYouDatabase() : base("WebAppTest") { }
        public DbSet<User> Users { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
    }
}