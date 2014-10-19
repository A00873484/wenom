using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;

namespace API.Controllers
{
    public class UsersController : ApiController
    {
        static readonly IUserRepository repository = new UserRepository();
        
        
        /// <summary>
        /// Gets All Users
        /// </summary>
        /// <returns>All Users</returns>
        public IEnumerable<User> GetAllUsers()
        {
            return repository.GetAll();
        }

        /// <summary>
        /// Gets the User
        /// </summary>
        /// <param name="id"></param>
        /// <returns>The User</returns>
        public User GetUser(int id)
        {
            User info = repository.Get(id);
            if (info == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return info;
        }

        /// <summary>
        /// Gets user by email
        /// </summary>
        /// <param name="email"></param>
        /// <returns>The User</returns>
        public IEnumerable<User> GetUserByEmail(string email)
        {
            return repository.GetAll().Where(u => string.Equals(u.Email, email, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Posts User in the url if the modelstate is valid
        /// </summary>
        /// <param name="info"></param>
        /// <returns>Either the response that the user was posted successfully or an error response</returns>
        public HttpResponseMessage PostUser(User info)
        {
            if (ModelState.IsValid)
            {
                info = repository.Add(info);
                var response = Request.CreateResponse<User>(HttpStatusCode.Created, info);

                string uri = Url.Link("DefaultApi", new { id = info.Id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }


        /// <summary>
        /// Puts the User 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="user"></param>
        public void PutUser(int id, User user)
        {
            user.Id = id;
            if (!repository.Update(user))
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Deletes the user
        /// </summary>
        /// <param name="id"></param>
        public void DeleteUser(int id)
        {
            User info = repository.Get(id);
            if(info == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            repository.Remove(id);
        }
    }
}
