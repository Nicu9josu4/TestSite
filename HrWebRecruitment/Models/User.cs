namespace HrWebRecruitment.Models
{
    public class User
    {
        public int ID { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string RoleID { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
    }
}
