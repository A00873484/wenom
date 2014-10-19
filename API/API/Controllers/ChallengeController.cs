using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using API.Models;

namespace API.Controllers
{
    public class ChallengeController : ApiController
    {
        static readonly IChallengeRepository repository = new ChallengeRepository();


        /// <summary>
        /// Gets All Users
        /// </summary>
        /// <returns>All Users</returns>
        public IEnumerable<Challenge> GetAllChallenge()
        {
            return repository.GetAll();
        }

        /// <summary>
        /// Gets the Challenge by id
        /// </summary>
        /// <param name="id"></param>
        /// <returns>The Challenge</returns>
        public Challenge GetChallenge(int id)
        {
            Challenge info = repository.Get(id);
            if (info == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            return info;
        }

        /// <summary>
        /// Gets Challenge by creator
        /// </summary>
        /// <param name="cName"></param>
        /// <returns>The Challenge(s)</returns>
        public IEnumerable<Challenge> GetChallengeByCreator(string cName)
        {
            return repository.GetAll().Where(c => string.Equals(c.Creator, cName, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Gets Challenge by Nominee
        /// </summary>
        /// <param name="nName"></param>
        /// <returns>The Challenge(s)</returns>
        public IEnumerable<Challenge> GetChallengeByNominee(string nName)
        {
            return repository.GetAll().Where(c => string.Equals(c.Nominee, nName, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Gets Challenge by Challenge Name
        /// </summary>
        /// <param name="name"></param>
        /// <returns>The Challenge(s)</returns>
        public IEnumerable<Challenge> GetChallengeByName(string name)
        {
            return repository.GetAll().Where(c => string.Equals(c.Name, name, StringComparison.OrdinalIgnoreCase));
        }

        /// <summary>
        /// Posts Challenge in the url if the modelstate is valid
        /// </summary>
        /// <param name="cinfo"></param>
        /// <returns>Either the response that the user was posted successfully or an error response</returns>
        public HttpResponseMessage PostUser(Challenge cinfo)
        {
            if (ModelState.IsValid)
            {
                cinfo = repository.Add(cinfo);
                var response = Request.CreateResponse<Challenge>(HttpStatusCode.Created, cinfo);

                string uri = Url.Link("DefaultApi", new { id = cinfo.Id });
                response.Headers.Location = new Uri(uri);
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }


        /// <summary>
        /// Puts the Challenge 
        /// </summary>
        /// <param name="id"></param>
        /// <param name="challenge"></param>
        public void PutChallenge(int id, Challenge challenge)
        {
            challenge.Id = id;
            if (!repository.Update(challenge))
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
        }

        /// <summary>
        /// Deletes the Challenge
        /// </summary>
        /// <param name="id"></param>
        public void DeleteChallenge(int id)
        {
            Challenge info = repository.Get(id);
            if (info == null)
            {
                throw new HttpResponseException(HttpStatusCode.NotFound);
            }
            repository.Remove(id);
        }
    }
}
