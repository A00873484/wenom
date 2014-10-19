using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class ChallengeRepository : IChallengeRepository
    {
        private List<Challenge> challenges = new List<Challenge>();
        private int _nextId = 1;

        /// <summary>
        /// Dummy data for now
        /// </summary>
        public ChallengeRepository()
        {
            Add(new Challenge { Id = 1, Name= "James' Rake Challenge", Creator = "James", Nominee = "Sideshow Bob", Approved = false, Goal = 2000});
            Add(new Challenge { Id = 2, Name = "Mr.Teeny's \"Make it look like an accident\" Challenge", Creator = "Mr.Teeny", Nominee = "Sideshow Mel", Approved = false, Goal = 2100.02 });
            Add(new Challenge { Id = 3, Name = "Krusty's Family Bonding Challenge", Creator = "Krusty The Clown", Nominee = "\"Sideshow\" Cecil", Approved = true, Goal = 15000});
        }

        /// <summary>
        /// Get All challenges
        /// </summary>
        /// <returns>All challenges</returns>
        public IEnumerable<Challenge> GetAll()
        {
            return challenges;
        }

        /// <summary>
        /// Gets challenge by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>challenge by id</returns>
        public Challenge Get(int id)
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
            cinfo.Id = _nextId++;
            challenges.Add(cinfo);
            return cinfo;
        }

        /// <summary>
        /// Removes challenge by its id
        /// </summary>
        /// <param name="id"></param>
        public void Remove(int id)
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