using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Miran.Models.EF;
using ExcelDataReader;
using System.Web.Services.Description;

namespace Miran.Controllers
{
    public class UserController : Controller
    {
        private AngularjsMvcDbContext db = null;
        public UserController()
        {
            db = new AngularjsMvcDbContext();
        }
        public JsonResult Index()
        {
            var users = db.Users.ToList();
            return Json(users, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Details(int id)
        {
            var user = db.Users.Find(id);
            return Json(user, JsonRequestBehavior.AllowGet);
        }
       
        [HttpPost]
        public JsonResult Create()
        {
            HttpPostedFileBase file = Request.Files["file"];
            string userJson = Request.Form["user"];
            User user = Newtonsoft.Json.JsonConvert.DeserializeObject<User>(userJson);
            if (file != null && file.ContentLength > 0)
            {
                string uploadPath = Server.MapPath("~/Upload/images");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                string fileName = Path.GetFileName(file.FileName);
                string filePath = Path.Combine(uploadPath, fileName);
                file.SaveAs(filePath);

                user.ImagePath = "/Upload/images/" + fileName;
            }
            db.Users.Add(user);
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult Edit()
        {
            HttpPostedFileBase file = Request.Files["file"];
            string userJson = Request.Form["user"];
            User user = Newtonsoft.Json.JsonConvert.DeserializeObject<User>(userJson);
            if (file != null && file.ContentLength > 0)
            {
                string uploadPath = Server.MapPath("~/Upload/images");
                if (!Directory.Exists(uploadPath))
                {
                    Directory.CreateDirectory(uploadPath);
                }

                string fileName = Path.GetFileName(file.FileName);
                string filePath = Path.Combine(uploadPath, fileName);
                file.SaveAs(filePath);

                user.ImagePath = "/Upload/images/" + fileName;
            }
            db.Entry(user).State = System.Data.Entity.EntityState.Modified;
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult Delete(int id) 
        {
            var user = db.Users.Find(id);
            db.Users.Remove(user);
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult Import(List<User> users)
        {
            users = users.Select(user =>
            {
                user.Password = GenerateRandomPassword(12);
                return user;
            }).ToList();

            db.Users.AddRange(users);
            db.SaveChanges();
            return Json(null);
        }

        [HttpPost]
        public JsonResult Login(string username, string password)
        {
            var user = db.Users.FirstOrDefault(u => u.Email == username && u.Password == password);

            if (user != null)
            {
              
                return Json(new { success = true, message = "Login successful" });
            }
            else
            {
                return Json(new { success = false, message = "Invalid credentials" });
            }
        }

        #region private
        private string GenerateRandomPassword(int length)
        {
            const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()";
            StringBuilder password = new StringBuilder();
            using (var rng = new RNGCryptoServiceProvider())
            {
                byte[] data = new byte[length];
                rng.GetBytes(data);
                foreach (byte b in data)
                {
                    password.Append(validChars[b % validChars.Length]);
                }
            }
            return password.ToString();
        }
        #endregion
    }
}