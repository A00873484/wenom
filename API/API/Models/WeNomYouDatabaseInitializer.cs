using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class WeNomYouDatabaseInitializer : DropCreateDatabaseIfModelChanges<WeNomYouDatabaseContext>
    {

        private List<User> users = new List<User>{
                new User { 
                    Id = 1, 
                    Email = "test@testing.com", 
                    FirstName = "Bob", 
                    LastName = "Burgers", 
                    PasswordHash = "!@#$%^1"
                },
                new User { 
                    Id = 2, 
                    Email = "test2@testing.com", 
                    FirstName = "George", 
                    LastName = "Curious", 
                    PasswordHash = "!@#$%^2"
                },
                new User { 
                    Id = 3, 
                    Email = "test3@testing.com", 
                    FirstName = "Logan", 
                    LastName = "Lohan", 
                    PasswordHash = "!@#$%^3"
                }
            };

        private List<Challenge> challenges = new List<Challenge>{
                new Challenge { 
                    Id = 1, 
                    Name= "James' Rake Challenge", 
                    Creator = "James", 
                    Nominee = "Sideshow Bob", 
                    Approved = false, 
                    Goal = 2000
                },
                new Challenge { 
                    Id = 2, 
                    Name = "Mr.Teeny's \"Make it look like an accident\" Challenge", 
                    Creator = "Mr.Teeny", 
                    Nominee = "Sideshow Mel", 
                    Approved = false, 
                    Goal = 2100.02 
                },
                new Challenge { 
                    Id = 3, 
                    Name = "Krusty's Family Bonding Challenge", 
                    Creator = "Krusty The Clown", 
                    Nominee = "\"Sideshow\" Cecil", 
                    Approved = true, 
                    Goal = 15000
                }
            };

        private int nextUserId = 3;
        private int nextChallengeId = 3;


        protected override void Seed(WeNomYouDatabaseContext context)
        {
            GetUsers().ForEach(u => context.Users.Add(u));
            GetChallenges().ForEach(c => context.Challenges.Add(c));
        }

        private List<User> GetUsers()
        {
            return users;
        }
        private List<Challenge> GetChallenges()
        {
            return challenges;
        }

        public User GetUser(int id)
        {
            return users.Find(u => u.Id == id);
        }

        public User Add(User uinfo)
        {
            if(uinfo == null)
            {
                throw new ArgumentNullException("uinfo");
            }
            uinfo.Id = nextUserId++;
            users.Add(uinfo);
            return uinfo;
        }

        public void RemoveUser(int id)
        {
            users.RemoveAll(u => u.Id == id);
        }

        public bool Update(User uinfo)
        {
            if(uinfo == null)
            {
                throw new ArgumentException("uinfo");
            }
            int index = users.FindIndex(u => u.Id == uinfo.Id);
            if(index == -1)
            {
                return false;
            }
            users.RemoveAt(index);
            users.Add(uinfo);
            return true;
        }

        /// <summary>
        /// Gets challenge by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>challenge by id</returns>
        public Challenge GetChallenge(int id)
        {
            return challenges.Find(c => c.Id == id);
        }

        /// <summary>
        /// Adds challenge into repository 
        /// </summary>
        /// <param name="cinfo"></param>
        /// <returns>challenge passed into parameter</returns>
        public Challenge Add(Challenge cinfo)
        {
            if (cinfo == null)
            {
                throw new ArgumentNullException("cinfo");
            }
            cinfo.Id = nextChallengeId++;
            challenges.Add(cinfo);
            return cinfo;
        }

        /// <summary>
        /// Removes challenge by its id
        /// </summary>
        /// <param name="id"></param>
        public void RemoveChallenge(int id)
        {
            challenges.RemoveAll(c => c.Id == id);
        }

        /// <summary>
        /// Updates by replacing the challenge that has the same challenge id as the parameter
        /// </summary>
        /// <param name="cinfo"></param>
        /// <returns>true if challenge is replaced</returns>
        public bool Update(Challenge cinfo)
        {
            if (cinfo == null)
            {
                throw new ArgumentException("info");
            }
            int index = challenges.FindIndex(c => c.Id == cinfo.Id);
            if (index == -1)
            {
                return false;
            }
            challenges.RemoveAt(index);
            challenges.Add(cinfo);
            return true;
        }


    }
}