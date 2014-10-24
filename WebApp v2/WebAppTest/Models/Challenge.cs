using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace WebAppTest.Models
{
    public class Challenge
    {
        public int Id { get; set; }

        [Required, StringLength(200), Display(Name = "Name")]
        public string Name { get; set; }

        [Required, StringLength(10000), Display(Name = "Description")]
        public string Discription { get; set; }

        [Required, StringLength(200), Display(Name = "Creator")]
        public string Creator { get; set; }

        [Required, StringLength(200), Display(Name = "Nominee")]
        public string Nominee { get; set; }

        public bool Approved { get; set; }

        [Required, Display(Name = "Goal")]
        public double Goal { get; set; }


    }
}