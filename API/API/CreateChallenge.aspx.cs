using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using API.Models;

namespace API
{
    public partial class CreateChallenge : System.Web.UI.Page
    {
        ChallengeRepository cr = new ChallengeRepository();
        
        protected void Page_Load(object sender, EventArgs e)
        {

        }

        protected void Button1_Click(object sender, EventArgs e)
        {
            Challenge c = new Challenge();
            c.Name = tbChallengeName.Text;
            c.Nominee = tbChallengeName.Text;
            c.Goal = Convert.ToDouble(tbGoal.Text);
            cr.Add(c);
        }
    }
}