using HrWebRecruitment;
using HrWebRecruitment.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using System.Data;
using System.Net;

internal class Program
{
    private static void Main(string[] args)
    {
        string _json;
        var builder = WebApplication.CreateBuilder(args);
        builder.Services.AddDbContext<ModelContext>();
        // Add services to the container.

        var app = builder.Build();
        string? _connectionString = app.Configuration.GetConnectionString("DefaultConnection");
        // Configure the HTTP request pipeline.
        ILoggerFactory loggerFactory = app.Services.GetService<ILoggerFactory>();
        ILogger logger = loggerFactory.CreateLogger("Program");

        app.UseHttpsRedirection();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.UseStatusCodePages();
        app.UseRouting();


        app.MapPost("/aplicate", async (HttpContext context, ModelContext db) =>
        {

            try
            {
                var form = context.Request.Form;
                if (form.Files != null)
                {
                    var file = form.Files[0];
                    var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\Uploads\\" + file.FileName);
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                       await file.CopyToAsync(stream);
                    }
                    var vac = db.Vacancies.ToList().FirstOrDefault(vacancy => vacancy.Title == form["VacancyTitle"]);
                    var IdNewName = db.Dictionaries.ToList().FirstOrDefault(dictionary => dictionary.Name == "New");
                    db.Add(new Candidat
                    {
                        FirstName = form["Name"],
                        LastName = form["Surname"], 
                        Email = form["Email"],
                        Phone = form["Phone"].ToString(),
                        Linkcv = "Uploads\\" + file.FileName

                    });
                    db.SaveChanges();
                    db.Add(new Hiring
                    {
                        Candidat = db.Candidats.Max(candidat => candidat.Id),
                        Vacancy = vac.Id,
                        StatusDate = DateTime.Now,
                        Status = IdNewName.Id,
                    });
                    db.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message + " " + ex.StackTrace);
            }
            Results.Redirect("/");
        });
        app.MapPost("/", async (context) =>
        {
            context.Response.ContentType = "text/html";
            await context.Response.SendFileAsync(@"wwwroot/index.html");
        });
        app.MapPost("/getVacancies", async (ModelContext db) =>
        {
            try
            {
                var vacancies = db.Vacancies.ToList();
                string json = JsonConvert.SerializeObject(vacancies);
                await Task.Delay(100);
                return json;
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message + " " + ex.StackTrace);
                return ex.Message;
            }
        });

        app.MapPost("/login", (HttpContext context, ModelContext db) =>
        {
            try
            {
                var form = context.Request.Form;
                var user = db.Users.ToList().FirstOrDefault(user => user.Username == form["uname"] && user.Password == form["pname"]);
                string json = JsonConvert.SerializeObject(user);
                return (json);
            }
            catch (Exception ex)
            {
                logger.LogError(ex.Message + " " + ex.StackTrace);
                return ex.Message;
            }
        });
        app.MapGet("/AdminPanel.html/{target}", (string target, ModelContext db) =>
        {
            string _json = " ";
            switch (target)
            {
                case "GetVacancy":
                    {
                        try
                        {
                            var vacancies = db.Vacancies.ToList();
                            _json = JsonConvert.SerializeObject(vacancies);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "GetHiring":
                    {
                        try
                        {
                            var hiringList = (from H in db.Hirings
                                              join C in db.Candidats on H.Candidat equals C.Id into JoinedCandidat
                                              from C in JoinedCandidat.DefaultIfEmpty()
                                              join U in db.Users on H.Users equals U.Id into JoinedUsers
                                              from U in JoinedUsers.DefaultIfEmpty()
                                              join D in db.Dictionaries on H.Status equals D.Id into JoinedDictionaries
                                              from D in JoinedDictionaries.DefaultIfEmpty()
                                              join V in db.Vacancies on H.Vacancy equals V.Id
                                              into JoinedHiring
                                              orderby H.Id
                                              from hList in JoinedHiring.DefaultIfEmpty()
                                              where H.Status != 8
                                              select new
                                              {
                                                  HiringId = H.Id,
                                                  CandidatID = H.Candidat,
                                                  Candidat = C.FirstName + " " + C.LastName,
                                                  User = U.FirstName + U.LastName ?? "admin",
                                                  Status = D.Name,
                                                  Vacancy = hList.Title,
                                                  H.StatusDate,
                                                  Comm = H.Comm ?? "required",
                                                  CV = C.Linkcv
                                              }).ToList();
                            _json = JsonConvert.SerializeObject(hiringList);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "GetUsers":
                    {
                        try
                        {
                            var userList = (from U in db.Users
                                            join D in db.Dictionaries on U.Roleid equals D.Id
                                            orderby U.Id
                                            select new
                                            {
                                                U.Id,
                                                U.Username,
                                                U.Password,
                                                U.FirstName,
                                                U.LastName,
                                                U.Email,
                                                RoleId = D.Name,
                                                U.StartDate,
                                                U.EndDate,
                                            }).ToList();
                            _json = JsonConvert.SerializeObject(userList);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "GetEmployees":
                    {
                        try
                        {
                            var employeesList = (from E in db.Employees
                                                 join D in db.Dictionaries on E.Position equals D.Id into JoinedDictionaries
                                                 from D in JoinedDictionaries.DefaultIfEmpty()
                                                 join DD in db.Dictionaries on E.Department equals DD.Id into JoinedDictionaries2
                                                 from DD in JoinedDictionaries2.DefaultIfEmpty()
                                                 join H in db.Hirings on E.Hiring equals H.Id into JoinedHirings
                                                 from H in JoinedHirings.DefaultIfEmpty()
                                                 join C in db.Candidats on H.Candidat equals C.Id
                                                 orderby E.Id
                                                 select new
                                                 {
                                                     E.Id,
                                                     E.FirstName,
                                                     E.LastName,
                                                     E.Phone,
                                                     E.Email,
                                                     Department = DD.Name,
                                                     Position = D.Name,
                                                     Hiring = C.FirstName + C.LastName,
                                                     E.StartDate,
                                                     E.EndDate
                                                 }).ToList();
                            _json = JsonConvert.SerializeObject(employeesList);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "GetDictionary":
                    {
                        try
                        {
                            var dictionaries = db.Dictionaries.ToList();
                            _json = JsonConvert.SerializeObject(dictionaries);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "GetStatuses":
                    {
                        try
                        {
                            var dictionaries = db.Dictionaries.Where(dict => dict.Type == "Status");
                            List<string> statuses = new();
                            foreach (var d in dictionaries)
                            {
                                statuses.Add(d.Name);
                            }
                            _json = JsonConvert.SerializeObject(statuses);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
            }
            return (_json);
        });
        app.MapPost("/AdminPanel.html/{target}/{action}", (string target, string action, HttpContext context, ModelContext db) =>
        {
            var form = context.Request.Form;
            switch (action)
            {
                case "getCandidats":
                    {
                        try
                        {
                            var users = db.Candidats.Distinct().ToList();
                            _json = JsonConvert.SerializeObject(users);
                            return (_json);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "getSelectedCandidat":
                    {
                        try
                        {
                            var user = db.Candidats.Where(candidat => candidat.Id.ToString().Equals(form["ID"])).First();
                            _json = JsonConvert.SerializeObject(user);
                            return (_json);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "SetNewUser":
                    {
                        try
                        {
                            var HrRole = db.Dictionaries.Where(dictionary => dictionary.Name == "HR").First().Id;
                            var mail = form["FirstName"].ToString().Substring(0, 1) + form["LastName"] + "@email.em";
                            db.Users.Add(new User
                            {
                                Username = form["Username"],
                                Password = form["Password"],
                                FirstName = form["FirstName"],
                                LastName = form["LastName"],
                                Email = mail,
                                Roleid = HrRole,
                                StartDate = DateTime.Now,
                                EndDate = null
                            });
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "getVacancyV":
                    {
                        try
                        {
                            var vacancy = db.Vacancies.First(vacancy => vacancy.Title.Equals(form["Title"]));
                            _json = JsonConvert.SerializeObject(vacancy);
                            return (_json);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "SetNewVacancy":
                    {
                        try
                        {
                            string Title = form["Title"];
                            string Description = form["Description"];
                            using (OracleConnection conn = new(_connectionString))
                            {
                                conn.Open();
                                using (OracleCommand cmd = conn.CreateCommand())
                                {
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    cmd.CommandText = "Set_Vacancy";
                                    cmd.Parameters.Add("P_VacancyTitle", OracleDbType.Varchar2).Value = Title;
                                    cmd.Parameters.Add("P_Description", OracleDbType.Varchar2).Value = Description;
                                    cmd.ExecuteScalar();
                                    return "Success";
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditVacancy":
                    {
                        try
                        {
                            string Title = form["Title"];
                            string Description = form["Description"];
                            int ID = Convert.ToInt32(form["ID"]);
                            using (OracleConnection conn = new(_connectionString))
                            {
                                conn.Open();
                                using (OracleCommand cmd = conn.CreateCommand())
                                {
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    cmd.CommandText = "Edit_Vacancy";
                                    cmd.Parameters.Add("P_ID", OracleDbType.Int32).Value = ID;
                                    cmd.Parameters.Add("P_VacancyTitle", OracleDbType.Varchar2).Value = Title;
                                    cmd.Parameters.Add("P_Description", OracleDbType.Varchar2).Value = Description;
                                    cmd.ExecuteScalar();
                                    return "Success";
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditHiring":
                    {
                        try
                        {
                            string status = form["Status"];
                            int candidatId = Convert.ToInt32(form["CandidatID"]);
                            int id = Convert.ToInt32(form["ID"]);
                            if (status == "Hired")
                            {
                                var hiringToRemove = db.Hirings.Where(hiring => hiring.Id == id).First();
                                var candidatToRemove = db.Candidats.Where(candidat => candidat.Id == candidatId).First();
                                var firstDepartment = db.Dictionaries.Where(dict => dict.Type == "Department").First();
                                var hrPosition = db.Dictionaries.Where(dict => dict.Type == "Roles").Where(role => role.Name == "HR").First();
                                db.Employees.Add(new Employee
                                {
                                    FirstName = candidatToRemove.FirstName,
                                    LastName = candidatToRemove.LastName,
                                    Phone = candidatToRemove.Phone,
                                    Email = candidatToRemove.Email,
                                    StartDate = DateTime.Now,
                                    Department = firstDepartment.Id,
                                    Hiring = hiringToRemove.Id,
                                    Position = hrPosition.Id
                                });
                                //db.Hirings.Remove(hiringToRemove);
                                //db.Candidats.Remove(candidatToRemove);
                                db.SaveChanges();


                            }
                            string description = form["Description"];


                            var dictionary = db.Dictionaries.Distinct().Where(value => value.Name == status).First();
                            var hiring = db.Hirings.Distinct().Where(hiring => hiring.Id == id).First();

                            hiring.Status = dictionary.Id;
                            hiring.Comm = description;
                            hiring.StatusDate = DateTime.Now;
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditEmployeeMenu": //TODO: {ID -> Username, Password, FirstName, LastName, E-Mail, EndDate}
                    {
                        try
                        {
                            int id = Convert.ToInt32(form["ID"]);
                            var employee = db.Employees.Where(employee => employee.Id == id).First();
                            var departments = db.Dictionaries.Where(dict => dict.Type == "Department").ToList();
                            var DepName = new List<string>();
                            foreach(var dep in departments)
                            {
                                DepName.Add(dep.Name);
                            }
                            var emp = new
                            {
                                employee.FirstName,
                                employee.LastName,
                                employee.Phone,
                                employee.Email,
                                employee.Position,
                                Department = DepName
                            };
                            _json = JsonConvert.SerializeObject(emp);
                            return _json;
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditEmployee": //TODO: {ID-> FirstName, LastName, Phone, Email, Department}
                    {
                        try
                        {

                            int id = Convert.ToInt32(form["ID"]);
                            var firstName = form["EmployeeFirstName"];
                            var lastName = form["EmployeeLastName"];
                            var phone = form["EmployeePhone"];
                            var department = form["EmployeeDepartment"];
                            var email = form["EmployeeEmail"];
                            var departments = db.Dictionaries.Where(dict => dict.Type == "Department").ToList();
                            var selectedDepartment = departments.Where(dep => dep.Name.Equals(department)).First();
                            //var departmentId = db.Dictionaries.Where(dict => dict.Id == department).First();

                            var employee = db.Employees.Where(employee => employee.Id == id).First();
                            employee.FirstName = firstName;
                            employee.LastName = lastName;
                            employee.Email = email;
                            employee.Department = selectedDepartment.Id;
                            employee.Phone = phone;
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditDictionaryMenu": //TODO: {ID -> Username, Password, FirstName, LastName, E-Mail, EndDate}
                    {
                        try
                        {
                            int id = Convert.ToInt32(form["ID"]);
                            var dictionary = db.Dictionaries.Where(dictionary => dictionary.Id == id).First();
                            _json = JsonConvert.SerializeObject(dictionary);
                            return _json;
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditDictionary": //TODO: {Id -> Name, Type, Description}
                    {
                        try
                        {
                            int id = Convert.ToInt32(form["ID"]);
                            var name = form["DictionaryName"];
                            var group = form["DictionaryGroup"];
                            var description = form["DictionaryDescription"];

                            var dictionary = db.Dictionaries.Where(dictionary => dictionary.Id == id).First();
                            dictionary.Name = name;
                            dictionary.Type = group;
                            dictionary.Description = description;
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditUser": 
                    {
                        try
                        {
                            int id = Convert.ToInt32(form["ID"]);
                            string firstName = form["UserFirstName"].ToString();
                            string lastName = form["UserLastName"].ToString();
                            string username = form["UserUsername"].ToString();
                            string password = form["UserPassword"].ToString();
                            string email = form["UserEmail"].ToString();
                            //DateTime endDate = DateTime.Parse(form["UserEndDate"]);

                            var user = db.Users.Where(user => user.Id == id).First();
                            user.FirstName = firstName;
                            user.LastName = lastName;
                            user.Username = username;
                            user.Password = password;
                            user.Email = email;
                            //user.EndDate = endDate;

                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditUserMenu": //TODO: {ID -> Username, Password, FirstName, LastName, E-Mail, EndDate}
                    {
                        try
                        {
                            int id = Convert.ToInt32(form["ID"]);
                            var user = db.Users.Where(user => user.Id == id).First();
                            _json = JsonConvert.SerializeObject(user);
                            return _json;
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditVacancyMenu":
                    {
                        try
                        {
                            int ID = Convert.ToInt32(form["ID"]);

                            var vacancy = db.Vacancies.Where(vacancy => vacancy.Id == ID).First();
                            var vac = new
                            {
                                VacancyID = ID,
                                VacancyTitle = vacancy.Title,
                                VacancyDescription = vacancy.Description,
                                VacancyEndDate = vacancy.EndDate
                            };
                            _json = JsonConvert.SerializeObject(vac);
                            return _json;
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "EditHiringMenu":
                    {
                        try
                        {
                            int ID = Convert.ToInt32(form["ID"]);

                            var hiring = db.Hirings.Where(hiring => hiring.Id == ID).First();
                            var statusName = db.Dictionaries.Where(dict => dict.Id == hiring.Status).First();
                            var hir = new
                            {
                                HiringID = ID,
                                HiringCandidat = hiring.Candidat,
                                HiringUsers = hiring.Users,
                                HiringStatus = statusName.Name,
                                HiringVacancy = hiring.Vacancy,
                                HiringStatusDate = hiring.StatusDate,
                                HiringComm = hiring.Comm

                            };
                                   _json = JsonConvert.SerializeObject(hir);
                                    return _json;
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "DeleteVacancy":
                    {
                        try
                        {
                            int ID = Convert.ToInt32(form["ID"]);
                            using (OracleConnection conn = new(_connectionString))
                            {
                                conn.Open();
                                using (OracleCommand cmd = conn.CreateCommand())
                                {
                                    cmd.CommandType = CommandType.StoredProcedure;
                                    cmd.CommandText = "Delete_Vacancy";
                                    cmd.Parameters.Add("P_ID", OracleDbType.Int32).Value = ID;
                                    cmd.ExecuteNonQuery();

                                    return "Success";
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "GetCandidat":
                    {
                        try
                        {
                            int HiringID = Convert.ToInt32(form["ID"]);
                            var candidat = db.Candidats.Where(candidat => candidat.Id == HiringID).First();
                            return JsonConvert.SerializeObject(candidat);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                    }
                case "DeleteUser":
                    {
                        try
                        {
                            int ID = Convert.ToInt32(form["ID"]);
                            var user = db.Users.Where(user => user.Id == ID).First();
                            db.Users.Remove(user);
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                        //return JsonConvert.SerializeObject(candidat);
                    }
                case "DeleteEmployee":
                    {
                        try
                        {
                            int ID = Convert.ToInt32(form["ID"]);
                            var employee = db.Employees.Where(employee=> employee.Id == ID)
                                .Include(entity=> entity.HiringNavigation)
                                .Include(entity => entity.DepartmentNavigation)
                                .Include(entity => entity.PositionNavigation).First();
                            db.Employees.Remove(employee);
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                        //return JsonConvert.SerializeObject(candidat);
                    }
                case "DeleteDictionary":
                    {
                        try
                        {
                            int ID = Convert.ToInt32(form["ID"]);
                            var dictionary = db.Dictionaries.Where(dictionary => dictionary.Id == ID)
                            .Include(entity=>entity.EmployeeDepartmentNavigations)
                            .Include(entity=>entity.EmployeePositionNavigations)
                            .First();
                            db.Dictionaries.Remove(dictionary);
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                        //return JsonConvert.SerializeObject(candidat);
                    }
                case "DeleteCandidat":
                    {
                        try
                        {
                            int ID = Convert.ToInt32(form["ID"]);
                            var hiring = db.Hirings.Where(hiring => hiring.Id == ID).Include(entity => entity.CandidatNavigation).First();
                            db.Hirings.Remove(hiring);
                            db.SaveChanges();
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                        //return JsonConvert.SerializeObject(candidat);
                    }
                case "GetCV":
                    {
                        try
                        {
                            //var candidat = db.Candidats.Where(candidat => candidat.Id.ToString().Equals(form["ID"])).First();
                            //context.Response.SendFileAsync(Directory.GetCurrentDirectory() + candidat.Linkcv);
                            //using FileStream fileStream = File.Open(Directory.GetCurrentDirectory() + candidat.Linkcv, FileMode.Open);

                            //var bytes = new byte[fileStream.Length];
                            //fileStream.Read(bytes, 0, bytes.Length);
                            //Results.Content(fileStream);
                        }
                        catch (Exception ex)
                        {
                            logger.LogError(ex.Message + " " + ex.StackTrace);
                        }
                        break;
                        //return JsonConvert.SerializeObject(candidat);
                    }
            }
            return (string.Empty);
        });
        app.Run();
    }

}
