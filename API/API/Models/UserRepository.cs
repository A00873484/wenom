using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    public class UserRepository : IUserRepository
    {
        private List<User> users = new List<User>();
        private int _nextId = 1;

        public UserRepository()
        {
            Add(new User { Id = 1, Email = "test@testing.com", FirstName = "Bob", LastName = "Burgers", PasswordHash = "!@#$%^1"});
            Add(new User { Id = 2, Email = "test2@testing.com", FirstName = "George", LastName = "Curious", PasswordHash = "!@#$%^2"});
            Add(new User { Id = 3, Email = "test3@testing.com", FirstName = "Logan", LastName = "Lohan", PasswordHash = "!@#$%^3"});
        }

        public IEnumerable<User> GetAll()
        {
            return users;
        }

        public User Get(int id)
        {
            return users.Find(u => u.Id == id);
        }

        public User Add(User uinfo)
        {
            if(uinfo == null)
            {
                throw new ArgumentNullException("uinfo");
            }
            uinfo.Id = _nextId++;
            users.Add(uinfo);
            return uinfo;
        }

        public void Remove(int id)
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
    }
}