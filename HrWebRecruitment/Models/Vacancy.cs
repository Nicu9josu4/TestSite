using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrWebRecruitment;

public partial class Vacancy
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public decimal Id { get; set; }

    public string? Title { get; set; }

    public string? Description { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }

    public virtual ICollection<Hiring> Hirings { get; set; } = new List<Hiring>();
}
