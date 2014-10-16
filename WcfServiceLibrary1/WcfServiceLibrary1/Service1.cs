using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.Text;
using System.Data.SqlClient;
using System.Data;

namespace WcfServiceLibrary1
{
    // NOTE: You can use the "Rename" command on the "Refactor" menu to change the class name "Service1" in both code and config file together.
    public class Service1 : IService1
    {
        public string GetData(int value)
        {
            return string.Format("You entered: {0}", value);
        }

        public CompositeType GetDataUsingDataContract(CompositeType composite)
        {
            if (composite == null)
            {
                throw new ArgumentNullException("composite");
            }
            if (composite.BoolValue)
            {
                composite.StringValue += "Suffix";
            }
            return composite;
        }

        public int getUser(int userid)
        {
            //// Create a connection to the "WeNomYou" SQL database located on the 
            //// local computer.
            //SqlConnection myConnection = new SqlConnection("Data Source=c106ta0dei.database.windows.net,1433\"SQLSERVER;Initial Catalog=WeNomYouDB;User ID=buklaudev;Password=Mirela#1");
            //// Connect to the SQL database using a SQL SELECT query to get all 
            //// the data from the "Titles" table.
            //SqlDataAdapter myCommand = new SqlDataAdapter("SELECT * " +
            //   " FROM Users WHERE UserID = \"" + userid + "\"" , myConnection);
            //// Create and fill a DataSet.
            //DataSet ds = new DataSet();
            //myCommand.Fill(ds);
            ////Create user and fill in properties
            //User user = new User();
            //user.UserId = Int32.Parse(ds.Tables[0].Rows[0]["UserID"].ToString());
            //user.FirstName = ds.Tables[0].Rows[0]["FirstName"].ToString();
            //user.LastName = ds.Tables[0].Rows[0]["LastName"].ToString();
            //user.PasswordHash = ds.Tables[0].Rows[0]["Hash"].ToString();
            //user.Email = ds.Tables[0].Rows[0]["Email"].ToString();

            //// Select from users table where userid = userid
            //// userid, user email, password


            return userid;
        }

        public void createUser(Register registrationData)
        {
            // Create a connection to the "WeNomYou" SQL database located on the server
            SqlConnection myConnection = new SqlConnection("Data Source=c106ta0dei.database.windows.net,1433\"SQLSERVER;Initial Catalog=WeNomYouDB;User ID=buklaudev;Password=Mirela#1");
            // Connect to the SQL database 
            // Insert into users table
            // userid, user email, password, email
            SqlDataAdapter myCommand = new SqlDataAdapter("INSERT INTO Users (UserID, FirstName, LastName, Hash, Email) VALUES ('" +
                registrationData.UserId + "', '" +
                registrationData.FirstName + "', '" +
                registrationData.LastName + "', '" +
                registrationData.PasswordHash + "', '" +
                registrationData.Email + "')" 
                , myConnection);
            
        }

        public void updateUser(int userid, User user)
        {
            // Create a connection to the "WeNomYou" SQL database located on the server
            SqlConnection myConnection = new SqlConnection("Data Source=c106ta0dei.database.windows.net,1433\"SQLSERVER;Initial Catalog=WeNomYouDB;User ID=buklaudev;Password=Mirela#1");
            // Connect to the SQL database 
            // Update users table where userid = user.userid
            // userid, user email, password
            SqlDataAdapter myCommand = new SqlDataAdapter("UPDATE Users SET FirstName=\"" + user.FirstName
                                                                      + "\", LastName=\"" + user.LastName
                                                                          + "\", Hash=\"" + user.PasswordHash
                                                                         + "\", Email=\"" + user.Email
                                                                   + "\" WHERE UserID=\"" + user.UserId
                                                                                          + "\"", myConnection);
            
        }

        public void deleteUser(int userid)
        {
            // Create a connection to the "WeNomYou" SQL database located on the 
            // local computer.
            SqlConnection myConnection = new SqlConnection("Data Source=c106ta0dei.database.windows.net,1433\"SQLSERVER;Initial Catalog=WeNomYouDB;User ID=buklaudev;Password=Mirela#1");
            // Connect to the SQL database 
            // Delete from users table where userid = user.userid
            SqlDataAdapter myCommand = new SqlDataAdapter("DELETE * " +
               " FROM Users WHERE UserID = \"" + userid + "\"" , myConnection);
            
        }

        public User login(Login loginData)
        {
            // Create a connection to the "WeNomYou" SQL database located on the 
            // local computer.
            SqlConnection myConnection = new SqlConnection("Data Source=c106ta0dei.database.windows.net,1433\"SQLSERVER;Initial Catalog=WeNomYouDB;User ID=buklaudev;Password=Mirela#1");
            // Connect to the SQL database using a SQL SELECT query to get all 
            // the data from the "Titles" table.
            SqlDataAdapter myCommand = new SqlDataAdapter("SELECT * " +
               " FROM Users WHERE Hash = \"" + loginData.PasswordHash + "\" && Email = \"" + loginData.Email + "\"" , myConnection);
            // Create and fill a DataSet.
            DataSet ds = new DataSet();
            myCommand.Fill(ds);
            //Create user and fill in properties
            User user = new User();
            user.PasswordHash = ds.Tables[0].Rows[0]["Hash"].ToString();
            user.Email = ds.Tables[0].Rows[0]["Email"].ToString();

            // Receives email(?) and hash of password (SHA256?)
            // Select from users table where passwordhash = loginData.passwordhash
            return user;
        }
    }
}
