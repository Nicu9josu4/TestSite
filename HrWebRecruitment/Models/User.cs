using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrWebRecruitment;

public partial class User
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public decimal Id { get; set; }

    public string? Username { get; set; }

    public string? Password { get; set; }

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public string? Email { get; set; }

    public decimal? Roleid { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}
