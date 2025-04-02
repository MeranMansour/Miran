using System;
using System.IO;
using System.Web;
using System.Web.Mvc;

namespace Miran.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }
    }
}