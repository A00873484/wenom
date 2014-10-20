using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using API.Models;

namespace API.Controllers
{
    public class ChallengesController : Controller
    {
        private WeNomYouDatabaseContext db = new WeNomYouDatabaseContext();

        // GET: Challenge
        public async Task<ActionResult> Index()
        {
            return View(await db.Challenges.ToListAsync());
        }

        // GET: Challenge/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Challenge challenge = await db.Challenges.FindAsync(id);
            if (challenge == null)
            {
                return HttpNotFound();
            }
            return View(challenge);
        }

        // GET: Challenge/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Challenge/Create
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include = "Id,Name,Creator,Nominee,Approved,Goal")] Challenge challenge)
        {
            if (ModelState.IsValid)
            {
                db.Challenges.Add(challenge);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(challenge);
        }

        // GET: Challenge/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Challenge challenge = await db.Challenges.FindAsync(id);
            if (challenge == null)
            {
                return HttpNotFound();
            }
            return View(challenge);
        }

        // POST: Challenge/Edit/5
        // To protect from overposting attacks, please enable the specific properties you want to bind to, for 
        // more details see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include = "Id,Name,Creator,Nominee,Approved,Goal")] Challenge challenge)
        {
            if (ModelState.IsValid)
            {
                db.Entry(challenge).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(challenge);
        }

        // GET: Challenge/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Challenge challenge = await db.Challenges.FindAsync(id);
            if (challenge == null)
            {
                return HttpNotFound();
            }
            return View(challenge);
        }

        // POST: Challenge/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Challenge challenge = await db.Challenges.FindAsync(id);
            db.Challenges.Remove(challenge);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
