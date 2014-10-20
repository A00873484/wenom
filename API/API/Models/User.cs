using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class User
    {
        public int Id { get; set; }

        [Required, StringLength(200), Display(Name = "First Name")]
        public string FirstName { get; set; }

        [Required, StringLength(200), Display(Name = "Last Name")]
        public string LastName { get; set; }

        [Required, StringLength(200), Display(Name = "Password")]
        public string PasswordHash { get; set; }

        [Required, StringLength(200), Display(Name = "Email")]
        public string Email { get; set; }

        
    }
}