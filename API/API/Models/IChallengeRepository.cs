using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace API.Models
{
    interface IChallengeRepository
    {
        IEnumerable<Challenge> GetAll();
        Challenge Get(int id);
        Challenge Add(Challenge info);
        void Remove(int id);
        bool Update(Challenge info);
    }
}
