using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrWebRecruitment;

public partial class Dictionary
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public decimal Id { get; set; }

    public string Name { get; set; } = null!;

    public string Type { get; set; } = null!;

    public string Description { get; set; } = null!;

    public virtual ICollection<Employee> EmployeeDepartmentNavigations { get; set; } = new List<Employee>();

    public virtual ICollection<Employee> EmployeePositionNavigations { get; set; } = new List<Employee>();

    public virtual ICollection<Hiring> Hirings { get; set; } = new List<Hiring>();
}
