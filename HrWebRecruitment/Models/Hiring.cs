using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrWebRecruitment;

public partial class Hiring
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public decimal Id { get; set; }

    public decimal Candidat { get; set; }

    public decimal? Users { get; set; }

    public decimal Status { get; set; }

    public decimal? Vacancy { get; set; }

    public DateTime? StatusDate { get; set; }

    public string? Comm { get; set; }

    public virtual Candidat CandidatNavigation { get; set; } = null!;

    public virtual ICollection<Employee> Employees { get; set; } = new List<Employee>();

    public virtual Dictionary StatusNavigation { get; set; } = null!;

    public virtual Vacancy? VacancyNavigation { get; set; }
}
