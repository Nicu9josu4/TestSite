using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace HrWebRecruitment;

public partial class Log
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public decimal LogId { get; set; }

    public string? Text { get; set; }

    public DateTime? Logdata { get; set; }

    public string? Errormessage { get; set; }
}
