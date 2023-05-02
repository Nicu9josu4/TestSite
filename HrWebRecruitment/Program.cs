using HrWebRecruitment.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Oracle.ManagedDataAccess.Client;
using Oracle.ManagedDataAccess.Types;
using System.Data;

internal class Program
{
    private static void Main(string[] args)
    {
        string _json;
        var builder = WebApplication.CreateBuilder(args);

        // Add services to the container.

        var app = builder.Build();
        string? _connectionString = app.Configuration.GetConnectionString("DefaultConnection");
        // Configure the HTTP request pipeline.

        app.UseHttpsRedirection();

        app.UseDefaultFiles();
        app.UseStaticFiles();

        app.UseStatusCodePages();
        app.UseRouting();

        app.MapPost("/", async () =>
        {
            string cmdStr = "select * from Vacancies";
            List<Vacancies> VacancyList = new();
            using (OracleConnection conn = new(_connectionString))
            {
                OracleCommand cmd = new(cmdStr, conn);
                conn.Open();
                OracleDataReader read = cmd.ExecuteReader();
                while (read.Read())
                {
                    Vacancies Vacancy = new()
                    {
                        ID = Convert.ToInt32(read["id"]),
                        Title = read["Title"].ToString(),
                        Description = read["Description"].ToString(),
                        StartDate = Convert.ToDateTime(read["StartDate"]).ToString("dd.MM.yyyy"),
                        EndDate = Convert.ToDateTime(read["EndDate"]).ToString("dd.MM.yyyy")
                    };
                    VacancyList.Add(Vacancy);
                }
                read.Close();
                string json = JsonConvert.SerializeObject(VacancyList);
                await Task.Delay(100);
                return json;
            }
        });
        app.MapPut("/", (HttpContext context) =>
        {
            //string _fileName;
            var form = context.Request.Form;
            var file = form.Files;
            string? Title = form["VacancyTitle"];
            //if (context.Request.Files.Count > 0)
            //{
            //    HttpPostedFile postedFile = context.Request.Files[0];
            //    //Set the Folder Path.
            //    string folderPath = context.Server.MapPath("/Uploads/");
            //    //Set the File Name.
            //    _fileName = Path.GetFileName(postedFile.FileName);
            //    //Save the File in Folder.
            //    postedFile.SaveAs(folderPath + _fileName);
            //}
            using (OracleConnection conn = new OracleConnection(_connectionString))
            {
                conn.Open();
                using (OracleCommand cmd = conn.CreateCommand())
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.CommandText = "Set_Candidat";
                    cmd.Parameters.Add("P_VacancyTitle", OracleDbType.Varchar2).Value = form["VacancyTitle"];
                    cmd.Parameters.Add("P_Name", OracleDbType.Varchar2).Value = form["Name"];
                    cmd.Parameters.Add("P_Surname", OracleDbType.Varchar2).Value = form["Surname"];
                    cmd.Parameters.Add("P_Email", OracleDbType.Varchar2).Value = form["Email"];
                    cmd.Parameters.Add("P_Phone", OracleDbType.Varchar2).Value = form["Phone"];
                    cmd.Parameters.Add("P_LinkCV", OracleDbType.Varchar2).Value = "/Uploads/" + file[0].FileName;
                    cmd.ExecuteNonQuery();
                    return Results.Redirect("/");
                }
            }
        });
        app.MapPost("/login", (HttpContext context) =>
        {
            var form = context.Request.Form;
            string? userName = form["uname"];
            string? userPass = form["pname"];
            string cmdStr = "select * from users where Username = '" + userName + "' and Password = '" + userPass + "'";
            List<User> UserList = new List<User>();
            using (OracleConnection conn = new OracleConnection(_connectionString))
            {
                OracleCommand cmd = new OracleCommand(cmdStr, conn);
                conn.Open();
                OracleDataReader read = cmd.ExecuteReader();
                while (read.Read())
                {
                    User webUser = new User
                    {
                        ID = Convert.ToInt32(read["ID"]),
                        Username = read["Username"].ToString(),
                        Password = read["Password"].ToString(),
                        RoleID = Convert.ToInt32(read["RoleID"]).ToString()
                    };
                    UserList.Add(webUser);
                }
                read.Close();
                string json = JsonConvert.SerializeObject(UserList);
                return (json);
            }
        });
        app.MapGet("/AdminPanel.html/{target}", (string target) =>
        {
            string _json = " ";
            switch (target)
            {
                case "GetVacancy":
                    {
                        string cmdStr = "select * from Vacancies";
                        List<Vacancies> VacancyList = new List<Vacancies>();
                        using (OracleConnection conn = new OracleConnection(_connectionString))
                        {
                            OracleCommand cmd = new OracleCommand(cmdStr, conn);
                            conn.Open();
                            OracleDataReader read = cmd.ExecuteReader();
                            while (read.Read())
                            {
                                Vacancies Vacancy = new Vacancies();
                                Vacancy.ID = Convert.ToInt32(read["id"]);
                                Vacancy.Title = read["Title"].ToString();
                                Vacancy.Description = read["Description"].ToString();
                                Vacancy.StartDate = Convert.ToDateTime(read["StartDate"]).ToString("dd.MM.yyyy");
                                Vacancy.EndDate = Convert.ToDateTime(read["EndDate"]).ToString("dd.MM.yyyy");
                                VacancyList.Add(Vacancy);
                            }
                            read.Close();
                            _json = JsonConvert.SerializeObject(VacancyList);
                        }
                        break;
                    }
                case "GetHiring":
                    {
                        string cmdStr = "SELECT h.id,c.first_name || ' ' || c.last_name AS candidat,u.first_name || ' ' || u.last_name AS USERS,d.name AS status,v.title AS vacancy,h.statusdate,h.comm from HIRING h LEFT JOIN candidat c ON h.candidat = c.id LEFT JOIN USERS u ON h.users = u.id LEFT JOIN DICTIONARY d ON h.status = d.id LEFT JOIN vacancies v ON h.vacancy = v.id ORDER BY h.id";
                        //string cmdStr = "select * from Hiring";
                        List<Hiring> HiringList = new List<Hiring>();
                        using (OracleConnection conn = new OracleConnection(_connectionString))
                        {
                            OracleCommand cmd = new OracleCommand(cmdStr, conn);
                            conn.Open();
                            OracleDataReader read = cmd.ExecuteReader();
                            while (read.Read())
                            {
                                Hiring Hiring = new Hiring();
                                Hiring.ID = Convert.ToInt32(read["id"]);
                                Hiring.Candidat = read["Candidat"].ToString();
                                Hiring.Users = read["Users"].ToString();
                                Hiring.Status = read["Status"].ToString();
                                Hiring.Vacancy = read["Vacancy"].ToString();
                                Hiring.StatusDate = Convert.ToDateTime(read["StatusDate"]).ToString("dd.MM.yyyy");
                                Hiring.Commentary = read["COMM"].ToString();
                                HiringList.Add(Hiring);
                            }
                            read.Close();
                            _json = JsonConvert.SerializeObject(HiringList);
                        }
                        break;
                    }
                case "GetUsers":
                    {
                        //string enddate;
                        string cmdStr = "SELECT u.id, u.username, u.password, u.first_name, u.last_name, u.email, d.name AS RoleId, u.startdata, u.enddata FROM USERS u LEFT JOIN DICTIONARY d ON u.roleid = d.id ORDER BY u.id";
                        //string cmdStr = "select * from Users";
                        List<User> UserList = new List<User>();
                        using (OracleConnection conn = new OracleConnection(_connectionString))
                        {
                            OracleCommand cmd = new OracleCommand(cmdStr, conn);
                            conn.Open();
                            OracleDataReader read = cmd.ExecuteReader();
                            while (read.Read())
                            {
                                User User = new User();
                                User.ID = Convert.ToInt32(read["id"]);
                                User.Username = read["Username"].ToString();
                                User.Password = read["Password"].ToString();
                                User.FirstName = read["First_Name"].ToString();
                                User.LastName = read["Last_Name"].ToString();
                                User.Email = read["Email"].ToString();
                                User.RoleID = read["RoleID"].ToString();
                                User.StartDate = Convert.ToDateTime(read["StartData"]).ToString("dd.MM.yyyy");
                                User.EndDate = read["EndData"].ToString();
                                UserList.Add(User);
                            }
                            read.Close();
                            _json = JsonConvert.SerializeObject(UserList);
                        }
                        break;
                    }
                case "GetEmployees":
                    {
                        string cmdStr = "select e.id,e.first_name,e.last_name,e.phone,e.email, dd.name AS Department, d.name AS position,  c.first_name || ' ' || c.last_name AS hiring ,e.startdate, e.enddate from EMPLOYEE e LEFT JOIN DICTIONARY d ON e.position = d.id LEFT JOIN DICTIONARY dd ON e.department = dd.id LEFT JOIN hiring h ON e.hiring = h.id LEFT JOIN candidat c ON c.id = h.candidat ORDER BY e.id";
                        //string cmdStr = "select * from Users";
                        List<Employees> EmployeesList = new List<Employees>();
                        using (OracleConnection conn = new OracleConnection(_connectionString))
                        {
                            OracleCommand cmd = new OracleCommand(cmdStr, conn);
                            conn.Open();
                            OracleDataReader read = cmd.ExecuteReader();
                            while (read.Read())
                            {
                                Employees Employees = new Employees();
                                Employees.ID = Convert.ToInt32(read["id"]);
                                Employees.FirstName = read["First_Name"].ToString();
                                Employees.LastName = read["Last_Name"].ToString();
                                Employees.Phone = read["Phone"].ToString();
                                Employees.Email = read["Email"].ToString();
                                Employees.Department = read["Department"].ToString();
                                Employees.Position = read["Position"].ToString();
                                Employees.Hiring = read["Hiring"].ToString();
                                Employees.StartDate = Convert.ToDateTime(read["StartDate"]).ToString("dd.MM.yyyy");
                                Employees.EndDate = read["EndDate"].ToString();
                                EmployeesList.Add(Employees);
                            }
                            read.Close();
                            _json = JsonConvert.SerializeObject(EmployeesList);
                        }
                        break;
                    }
                case "GetDictionary":
                    {
                        string cmdStr = "select * from Dictionary";
                        List<Dictionary> DictionaryList = new List<Dictionary>();
                        using (OracleConnection conn = new OracleConnection(_connectionString))
                        {
                            OracleCommand cmd = new OracleCommand(cmdStr, conn);
                            conn.Open();
                            OracleDataReader read = cmd.ExecuteReader();
                            while (read.Read())
                            {
                                Dictionary Dictionary = new Dictionary();
                                Dictionary.ID = Convert.ToInt32(read["id"]);
                                Dictionary.Name = read["Name"].ToString();
                                Dictionary.Type = read["Grupa"].ToString();
                                Dictionary.Description = read["Description"].ToString();
                                DictionaryList.Add(Dictionary);
                            }
                            read.Close();
                            _json = JsonConvert.SerializeObject(DictionaryList);
                        }
                        break;
                    }
            }
            return (_json);
        });
        app.MapPost("/AdminPanel.html/{target}/{action}", (string target, string action, HttpContext context) =>
        {
            var form = context.Request.Form;
            switch (action)
            {
                case "getVacancyV":
                    {
                        string Title = form["Title"];
                        string cmdStr = "select distinct * from Vacancies where Title = '" + Title + "'";
                        List<Vacancies> VacancyList = new List<Vacancies>();
                        using (OracleConnection conn = new OracleConnection(_connectionString))
                        {
                            OracleCommand cmd = new OracleCommand(cmdStr, conn);
                            conn.Open();
                            OracleDataReader read = cmd.ExecuteReader();
                            while (read.Read())
                            {
                                Vacancies Vacancy = new Vacancies();
                                Vacancy.Title = read["Title"].ToString();
                                Vacancy.Description = read["Description"].ToString();
                                VacancyList.Add(Vacancy);
                            }
                            read.Close();
                            _json = JsonConvert.SerializeObject(VacancyList);
                        }
                        return (_json);
                    }
                case "SetNewVacancy":
                    {
                        string Title = form["Title"];
                        string Description = form["Description"];
                        using (OracleConnection conn = new OracleConnection(_connectionString))
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
                case "EditVacancy":
                    {
                        string Title = form["Title"];
                        string Description = form["Description"];
                        int ID = Convert.ToInt32(form["ID"]);
                        using (OracleConnection conn = new OracleConnection(_connectionString))
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
                case "EditVacancyMenu":
                    {
                        int ID = Convert.ToInt32(form["ID"]);
                        using (OracleConnection conn = new OracleConnection(_connectionString))
                        {
                            conn.Open();
                            using (OracleCommand cmd = conn.CreateCommand())
                            {
                                cmd.CommandType = CommandType.StoredProcedure;
                                cmd.CommandText = "Edit_VacancyMenu";
                                cmd.Parameters.Add("Res", OracleDbType.Clob, ParameterDirection.ReturnValue);
                                cmd.Parameters.Add("P_ID", OracleDbType.Int32).Value = ID;
                                cmd.ExecuteNonQuery();

                                OracleClob myClob = (OracleClob)cmd.Parameters["Res"].Value;
                                var valuesFromClob = myClob.Value;
                                var dataFromClob = JObject.Parse(valuesFromClob);
                                _json = JsonConvert.SerializeObject(dataFromClob);
                                return _json;
                            }
                        }
                    }
                case "DeleteVacancy":
                    {
                        int ID = Convert.ToInt32(form["ID"]);
                        using (OracleConnection conn = new OracleConnection(_connectionString))
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
            }
            return (string.Empty);
        });

        app.UseEndpoints(endpoints =>
        {
        });
        app.Run();
    }

}
