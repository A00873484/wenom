using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using API.Models;
using API.Controllers;
using System.Security.Cryptography;
using System.Text;

namespace API
{
    public partial class Register : System.Web.UI.Page
    {
        
        protected void Page_Load(object sender, EventArgs e)
        {
            
        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            User user = new User();
            user.FirstName = tbFirstName.Text;
            user.LastName = tbLastName.Text;
            user.Email = tbEmail.Text;
            user.PasswordHash = sha256(tbPassword.Text);
            
        }

        static string sha256(string password)
        {
            SHA256Managed crypt = new SHA256Managed();
            string hash = String.Empty;
            byte[] crypto = crypt.ComputeHash(Encoding.UTF8.GetBytes(password), 0, Encoding.UTF8.GetByteCount(password));
            foreach (byte bit in crypto)
            {
                hash += bit.ToString("x2");
            }
            return hash;
        }
    }
}