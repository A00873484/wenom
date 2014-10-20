using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace WebAppTest.Models
{
    public class WeNomYouDatabaseContext : DbContext
    {
        public WeNomYouDatabaseContext() : base("API") { }
        public DbSet<User> Users { get; set; }
        public DbSet<Challenge> Challenges { get; set; }
    }
}