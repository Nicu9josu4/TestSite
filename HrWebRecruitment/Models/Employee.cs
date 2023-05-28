using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrWebRecruitment;

public partial class Employee
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public decimal Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Phone { get; set; }

    public string? Email { get; set; }

    public decimal Department { get; set; }

    public decimal Position { get; set; }

    public decimal Hiring { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public virtual Dictionary DepartmentNavigation { get; set; } = null!;

    public virtual Hiring HiringNavigation { get; set; } = null!;

    public virtual Dictionary PositionNavigation { get; set; } = null!;
}
