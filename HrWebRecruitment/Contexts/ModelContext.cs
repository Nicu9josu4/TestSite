using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace HrWebRecruitment.Contexts;

public partial class ModelContext : DbContext
{
    public ModelContext()
    {
    }

    public ModelContext(DbContextOptions<ModelContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Candidat> Candidats { get; set; }

    public virtual DbSet<Dictionary> Dictionaries { get; set; }

    public virtual DbSet<Employee> Employees { get; set; }

    public virtual DbSet<Hiring> Hirings { get; set; }

    public virtual DbSet<Log> Logs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Vacancy> Vacancies { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseOracle("Data Source=localhost:1521/orcl.moldcell.intern;Persist Security Info=True;User ID=WebDeveloper;Password=nicu9josu4");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .HasDefaultSchema("WEBDEVELOPER")
            .UseCollation("USING_NLS_COMP");

        modelBuilder.Entity<Candidat>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("CANDIDAT_PK");

            entity.ToTable("CANDIDAT");

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("ID");
            entity.Property(e => e.Email)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("FIRST_NAME");
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LAST_NAME");
            entity.Property(e => e.Linkcv)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("LINKCV");
            entity.Property(e => e.Phone)
                .HasMaxLength(30)
                .HasColumnName("PHONE");
        });

        modelBuilder.Entity<Dictionary>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("DICTIONARY_PK");

            entity.ToTable("DICTIONARY");

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("ID");
            entity.Property(e => e.Description)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("DESCRIPTION");
            entity.Property(e => e.Type)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("GRUPA");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("NAME");
        });

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("EMPLOYEE_PK");

            entity.ToTable("EMPLOYEE");

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("ID");
            entity.Property(e => e.Department)
                .HasColumnType("NUMBER")
                .HasColumnName("DEPARTMENT");
            entity.Property(e => e.Email)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.EndDate)
                .HasColumnType("DATE")
                .HasColumnName("ENDDATE");
            entity.Property(e => e.FirstName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("FIRST_NAME");
            entity.Property(e => e.Hiring)
                .HasColumnType("NUMBER")
                .HasColumnName("HIRING");
            entity.Property(e => e.LastName)
                .HasMaxLength(30)
                .IsUnicode(false)
                .HasColumnName("LAST_NAME");
            entity.Property(e => e.Phone)
                .HasMaxLength(30)
                .HasColumnName("PHONE");
            entity.Property(e => e.Position)
                .HasColumnType("NUMBER")
                .HasColumnName("POSITION");
            entity.Property(e => e.StartDate)
                .HasColumnType("DATE")
                .HasColumnName("STARTDATE");

            entity.HasOne(d => d.DepartmentNavigation).WithMany(p => p.EmployeeDepartmentNavigations)
                .HasForeignKey(d => d.Department)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EMPLOYEED");

            entity.HasOne(d => d.HiringNavigation).WithMany(p => p.Employees)
                .HasForeignKey(d => d.Hiring)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EMPLOYEEH");

            entity.HasOne(d => d.PositionNavigation).WithMany(p => p.EmployeePositionNavigations)
                .HasForeignKey(d => d.Position)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_EMPLOYEEP");
        });

        modelBuilder.Entity<Hiring>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("HIRING_PK");

            entity.ToTable("HIRING");

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("ID");
            entity.Property(e => e.Candidat)
                .HasColumnType("NUMBER")
                .HasColumnName("CANDIDAT");
            entity.Property(e => e.Comm)
                .HasMaxLength(500)
                .IsUnicode(false)
                .HasColumnName("COMM");
            entity.Property(e => e.Status)
                .HasColumnType("NUMBER")
                .HasColumnName("STATUS");
            entity.Property(e => e.StatusDate)
                .HasColumnType("DATE")
                .HasColumnName("STATUSDATE");
            entity.Property(e => e.Users)
                .HasColumnType("NUMBER")
                .HasColumnName("USERS");
            entity.Property(e => e.Vacancy)
                .HasColumnType("NUMBER")
                .HasColumnName("VACANCY");

            entity.HasOne(d => d.CandidatNavigation).WithMany(p => p.Hirings)
                .HasForeignKey(d => d.Candidat)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HIRINGC");

            entity.HasOne(d => d.StatusNavigation).WithMany(p => p.Hirings)
                .HasForeignKey(d => d.Status)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HIRINGS");

            entity.HasOne(d => d.VacancyNavigation).WithMany(p => p.Hirings)
                .HasForeignKey(d => d.Vacancy)
                .HasConstraintName("FK_HIRINGV");
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("SYS_C0020913");

            entity.ToTable("LOGS");

            entity.Property(e => e.LogId)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("LOG_ID");
            entity.Property(e => e.Errormessage)
                .HasMaxLength(3200)
                .IsUnicode(false)
                .HasColumnName("ERRORMESSAGE");
            entity.Property(e => e.Logdata)
                .HasDefaultValueSql("SYSDATE")
                .HasColumnType("DATE")
                .HasColumnName("LOGDATA");
            entity.Property(e => e.Text)
                .HasMaxLength(1000)
                .IsUnicode(false)
                .HasColumnName("TEXT");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SYS_C0036017");

            entity.ToTable("USERS");

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("ID");
            entity.Property(e => e.Email)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("EMAIL");
            entity.Property(e => e.EndDate)
                .HasColumnType("DATE")
                .HasColumnName("ENDDATA");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("FIRST_NAME");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("LAST_NAME");
            entity.Property(e => e.Password)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("PASSWORD");
            entity.Property(e => e.Roleid)
                .HasColumnType("NUMBER")
                .HasColumnName("ROLEID");
            entity.Property(e => e.StartDate)
                .HasColumnType("DATE")
                .HasColumnName("STARTDATA");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("USERNAME");
        });

        modelBuilder.Entity<Vacancy>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SYS_C0034847");

            entity.ToTable("VACANCIES");

            entity.Property(e => e.Id)
                .ValueGeneratedOnAdd()
                .HasColumnType("NUMBER")
                .HasColumnName("ID");
            entity.Property(e => e.Description)
                .HasMaxLength(3000)
                .IsUnicode(false)
                .HasColumnName("DESCRIPTION");
            entity.Property(e => e.EndDate)
                .HasColumnType("DATE")
                .HasColumnName("ENDDATE");
            entity.Property(e => e.StartDate)
                .HasColumnType("DATE")
                .HasColumnName("STARTDATE");
            entity.Property(e => e.Title)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("TITLE");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
