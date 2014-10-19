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

        public ChallengeRepository()
        {
            Add(new Challenge { Id = 1, Name= "James' Rake Challenge", Creator = "James", Nominee = "Sideshow Bob", Approved = false});
            Add(new Challenge { Id = 2, Name = "Mr.Teeny's \"Make it look like an accident\" Challenge", Creator = "Mr.Teeny", Nominee = "Sideshow Mel", Approved = false });
            Add(new Challenge { Id = 3, Name = "Krusty's Family Bonding Challenge", Creator = "Krusty The Clown", Nominee = "\"Sideshow\" Cecil", Approved = true });
        }

        public IEnumerable<Challenge> GetAll()
        {
            return challenges;
        }

        public Challenge Get(int id)
        {
            return challenges.Find(c => c.Id == id);
        }

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

        public void Remove(int id)
        {
            challenges.RemoveAll(c => c.Id == id);
        }

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