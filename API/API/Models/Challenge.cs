using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class Challenge
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Creator { get; set; }
        public string Nominee { get; set; }
        public bool Approved { get; set; }
        public double Goal { get; set; }
    }
}