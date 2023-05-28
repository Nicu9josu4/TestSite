$(document).ready(function () {
    $('.WelcomeToPanel').css('display', 'none');
    $('.addVacancies').show();
    //$.cookie('cookie', 'val');
    var target = 'GetVacancy';
    var ID = "";
    var CandidatID = 0;


    const StatusArray = [];

    $.ajax({
        method: "GET",
        url: "/AdminPanel.html/GetStatuses",
        data:
        {
            action: "GetComponents",
        },
        dataType: 'json',
        success: function (data) {
            $(data).each(function (index, num) {

                StatusArray.push(num);
            });
            //StatusArray = JSON.parse(data);
        },

    });
    function GetNextStatus(currentStatus) {




        var index = StatusArray.indexOf(currentStatus);
        if (index >= 0 && index < StatusArray.length - 1)
            return StatusArray[index + 1];
        else return 'New';


        //if (currentStatus === StatusArray[StatusArray.length - 1]) {
        //    return 'New';
        //}
        //else {
        //    const iterator = StatusArray.values();
        //    for (const status in iterator) {
        //        if (iterator.next().value === currentStatus)
        //            return iterator.value;
        //    }
        //}
    }
    //var a = GetNextStatus('New');
    //var b = GetNextStatus('Analyzing');

    function getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    var role = getCookie("role");
    if (role === "Admin") {
        $(".topnav").append('<a id="UsersModal-btn" class="LinkToModal">Users</a>' +
            '<a id="DictionaryModal-btn" class="LinkToModal">Dictionary</a>');
        //$('#DictionaryModal-btn').show();
        //$('#EmployeesModal-btn' ).show();
        //$('#UsersModal-btn'     ).show();
    }

    if (role != null) {
        $('#LogOutModal-btn').on('mousedown', function () {
            document.cookie = "role=";
            document.location.href = "/";
            //$.removeCookie("role", null, { path: "/" });
        });
    }

    function GetVacancy(data) {

        var i = 1;
        var HeadTable = $('.VacanciesTable thead');
        var BodyTable = $('.VacanciesTable tbody');
        BodyTable.empty();
        HeadTable.empty();
        $('#SelectModel').empty();
        $('#SelectModel').append('<option selected>Select Model...</option>');
        HeadTable.append(
            '<tr><th width="10px">№</th>'
            + '<th width="80px">Title</th>'
            + '<th width="300px">Description</th>'
            + '<th width="50px">StartDate</th>'
            + '<th width="50px">EndDate</th></tr>');
        $(data).each(function (index, num) {
            $('#SelectModel').append('<option>' + num.Title + '</option>');
            BodyTable.append(
                '<tr><td align="center" class="rowNumber" value="' + num.Id + '">' + i + '</td>'
                + '<td class="Title">' + num.Title + '</td>'
                + '<td class="Description">' + num.Description + '</td>'
                + '<td class="StartDate">' + num.StartDate + '</td>'
                + '<td class="EndDate">' + num.EndDate + '<a href="#" class="editFromVacancyTable">...edit</a></td></tr>');

            i = i + 1;
        });
        $('#SelectModel').append('<option>Custom Model</option>');
        $('tr').hover(function () {
            $(this).css('background-color', '#edf2fa');
        }, function () {
            $(this).css('background-color', '');
        });
    }
    function GetHiring(data) {
        var i = 1;
        var HeadTable = $('.HiringTable thead');
        var BodyTable = $('.HiringTable tbody');
        BodyTable.empty();
        HeadTable.empty();
        HeadTable.append(
            '<th width="10px">№</th>'
            + '<th width="80px"> Candidat</th>'
            + '<th width="80px">Users</th>'
            + '<th width="80px">Status</th>'
            + '<th width="80px">Vacancy</th>'
            + '<th width="10px">StatusDate</th>'
            + '<th width="200px">Commentary</th>');
        $(data).each(function (index, num) {
            BodyTable.append(
                '<tr><td align="center" class="rowNumber" value="' + num.HiringId + '">' + i + '</td>'
                + '<td class="Candidat" value="' + num.CandidatID + '">' + num.Candidat + '</td>'
                + '<td class="Users">' + num.User + '</td>'
                + '<td class="Status" value="' + num.CV + '">' + num.Status + '</td>'
                + '<td class="Vacancy">' + num.Vacancy + '</td>'
                + '<td class="StatusDate">' + num.StatusDate + '</td>'
                + '<td class="Commentary">' + num.Comm + '<a href="#" class="editFromHiringTable">...edit</a></td></tr>')
            i = i + 1;
        });
        $('tr').hover(function () {
            $(this).css('background-color', '#edf2fa');
        }, function () {
            $(this).css('background-color', '');
        });
    }
    function GetUsers(data) {
        var i = 1;
        var HeadTable = $('.UsersTable thead');
        var BodyTable = $('.UsersTable tbody');
        BodyTable.empty();
        HeadTable.empty();
        HeadTable.append(
            '<tr><th width="10px">№</th>'
            + '<th width="80px">Username</th>'
            + '<th width="80px">Password</th>'
            + '<th width="80px">FirstName</th>'
            + '<th width="80px">LastName</th>'
            + '<th width="80px">E-mail</th>'
            + '<th width="50px">RoleId</th>'
            + '<th width="80px">StartDate</th>'
            + '<th width="80px">EndDate</th></tr>');
        $(data).each(function (index, num) {

            if (role === "Admin") {
                BodyTable.append(
                    '<tr><td align="center" class="rowNumber" value="' + num.Id + '">' + i + '</td>'
                    + '<td class="Username">' + num.Username + '</td>'
                    + '<td class="Password">' + num.Password + '</td>'
                    + '<td class="FirstName">' + num.FirstName + '</td>'
                    + '<td class="LastName">' + num.LastName + '</td>'
                    + '<td class="Email">' + num.Email + '</td>'
                    + '<td class="RoleID">' + num.RoleId + '</td>'
                    + '<td class="StartDate">' + num.StartDate + '</td>'
                    + '<td class="EndDate">' + num.EndDate + '<a href="#" class="editFromUsersTable">...edit</a></td></tr>')//
                i = i + 1;
            } else {
                BodyTable.append(
                    '<tr><td align="center" class="rowNumber" value="' + num.Id + '">' + i + '</td>'
                    + '<td class="Username">' + num.Username + '</td>'
                    + '<td class="Password">' + num.Password + '</td>'
                    + '<td class="FirstName">' + num.FirstName + '</td>'
                    + '<td class="LastName">' + num.LastName + '</td>'
                    + '<td class="Email">' + num.Email + '</td>'
                    + '<td class="RoleID">' + num.RoleId + '</td>'
                    + '<td class="StartDate">' + num.StartDate + '</td>'
                    + '<td class="EndDate">' + num.EndDate + '</td></tr>')//<a href="#" class="editFromUsersTable">...edit</a>
                i = i + 1;
            }

        });
        $('tr').hover(function () {
            $(this).css('background-color', '#edf2fa');
        }, function () {
            $(this).css('background-color', '');
        });
    }
    function GetEmployees(data) {
        var i = 1;
        var HeadTable = $('.EmployeesTable thead');
        var BodyTable = $('.EmployeesTable tbody');
        BodyTable.empty();
        HeadTable.empty();
        HeadTable.append(
            '<tr><th width="10px">№</th>'
            + '<th width="80px">FirstName</th>'
            + '<th width="80px">LastName</th>'
            + '<th width="80px">Phone</th>'
            + '<th width="100px">E-mail</th>'
            + '<th width="50px">Department</th>'
            + '<th width="50px">Position</th>'
            + '<th width="20px">Hiring</th>'
            + '<th width="80px">StartDate</th>'
            + '<th width="80px">EndDate</th></tr>');
        $(data).each(function (index, num) {
            if (role === "Admin") {
                BodyTable.append(
                    '<tr><td align="center" class="rowNumber" value="' + num.Id + '">' + i + '</td>'
                    + '<td class="FirstName">' + num.FirstName + '</td>'
                    + '<td class="LastName">' + num.LastName + '</td>'
                    + '<td class="Phone">' + num.Phone + '</td>'
                    + '<td class="Email">' + num.Email + '</td>'
                    + '<td class="Department">' + num.Department + '</td>'
                    + '<td class="Position">' + num.Position + '</td>'
                    + '<td class="Hiring">' + num.Hiring + '</td>'
                    + '<td class="StartDate">' + num.StartDate + '</td>'
                    + '<td class="EndDate">' + num.EndDate + '<a href="#" class="editFromEmployeesTable">...edit</a></td></tr>')//
                i = i + 1;
            } else {
                BodyTable.append(
                    '<tr><td align="center" class="rowNumber" value="' + num.Id + '">' + i + '</td>'
                    + '<td class="FirstName">' + num.FirstName + '</td>'
                    + '<td class="LastName">' + num.LastName + '</td>'
                    + '<td class="Phone">' + num.Phone + '</td>'
                    + '<td class="Email">' + num.Email + '</td>'
                    + '<td class="Department">' + num.Department + '</td>'
                    + '<td class="Position">' + num.Position + '</td>'
                    + '<td class="Hiring">' + num.Hiring + '</td>'
                    + '<td class="StartDate">' + num.StartDate + '</td>'
                    + '<td class="EndDate">' + num.EndDate + '</td></tr>')//<a href="#" class="editFromEmployeesTable">...edit</a>
                i = i + 1;
            }

        });
        $('tr').hover(function () {
            $(this).css('background-color', '#edf2fa');
        }, function () {
            $(this).css('background-color', '');
        });
    }
    function GetDictionary(data) {
        var i = 1;
        var HeadTable = $('.DictionaryTable thead');
        var BodyTable = $('.DictionaryTable tbody');
        BodyTable.empty();
        HeadTable.empty();
        HeadTable.append(
            '<tr><th width="10px">№</th>'
            + '<th width="80px">Name</th>'
            + '<th width="80px">Type</th>'
            + '<th width="200px">Description</th></tr>');
        $(data).each(function (index, num) {
            if (role === "Admin") {
                BodyTable.append(
                    '<tr><td align="center" class="rowNumber" value="' + num.Id + '">' + i + '</td>'
                    + '<td class="Name">' + num.Name + '</td>'
                    + '<td class="Type">' + num.Type + '</td>'
                    + '<td class="Description">' + num.Description + '<a href="#" class="editFromDictionaryTable">...edit</a></td>')//
                i = i + 1;
            } else {
                BodyTable.append(
                    '<tr><td align="center" class="rowNumber" value="' + num.Id + '">' + i + '</td>'
                    + '<td class="Name">' + num.Name + '</td>'
                    + '<td class="Type">' + num.Type + '</td>'
                    + '<td class="Description">' + num.Description + '</td>')//<a href="#" class="editFromDictionaryTable">...edit</a>
                i = i + 1;
            }

        });
        $('tr').hover(function () {
            $(this).css('background-color', '#edf2fa');
        }, function () {
            $(this).css('background-color', '');
        });
    }
    //history.replaceState({}, false, "admin");
    $('.PopUpAddVacancyWindow-Behind').hide();
    $('.topnav .LinkToModal').on('click', function () {
        $('.LinkToModal').removeClass('topNavSelected');
        $(this).addClass('topNavSelected');

        if ($('#VacanciesModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', '');
            $('.HiringTable').css('display', 'none');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', 'none');
            $('.DictionaryTable').css('display', 'none');
            $('.addUser').hide();
            $('.addVacancies').show();
            target = 'GetVacancy';
        }
        else if ($('#HiringModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', 'none');
            $('.HiringTable').css('display', '');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', 'none');
            $('.DictionaryTable').css('display', 'none');
            $('.addUser').hide();
            $('.addVacancies').hide();
            target = 'GetHiring';
        }
        else if ($('#UsersModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', 'none');
            $('.HiringTable').css('display', 'none');
            $('.UsersTable').css('display', '');
            $('.EmployeesTable').css('display', 'none');
            $('.DictionaryTable').css('display', 'none');
            $('.addVacancies').hide();
            if (role === "Admin")
                $('.addUser').show();
            else
                $('.addUser').hide();
            target = 'GetUsers';
        }
        else if ($('#EmployeesModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', 'none');
            $('.HiringTable').css('display', 'none');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', '');
            $('.DictionaryTable').css('display', 'none');
            $('.addUser').hide();
            $('.addVacancies').hide();
            target = 'GetEmployees';
        }
        else if ($('#DictionaryModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', 'none');
            $('.HiringTable').css('display', 'none');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', 'none');
            $('.DictionaryTable').css('display', '');
            $('.addUser').hide();
            $('.addVacancies').hide();
            target = 'GetDictionary';
        }

        $.ajax({
            method: "GET",
            url: "/AdminPanel.html/" + target,
            data:
            {
                action: "GetComponents",
                target: target
            },
            dataType: 'json',
            success: function (data) {
                switch (target) {
                    case 'GetVacancy':
                        {
                            GetVacancy(data);
                            break;
                        }
                    case 'GetHiring':
                        {
                            GetHiring(data);
                            break;
                        }
                    case 'GetUsers':
                        {
                            GetUsers(data);
                            break;
                        }
                    case 'GetEmployees':
                        {
                            GetEmployees(data);
                            break;
                        }
                    case 'GetDictionary':
                        {
                            GetDictionary(data);
                            break;
                        }
                }
                //$(document).on('click', function (e) {
                //    if ($(".PopUpAddVacancyWindow").hasClass("isOpen"))
                //        $('.PopUpAddVacancyWindow-Behind').removeClass("isOpen");
                //});

                $('tr').hover(function () {
                    $(this).css('background-color', '#edf2fa');
                }, function () {
                    $(this).css('background-color', '');
                });

                $('.editFromHiringTable').on('click', function (e) {
                    var element = e.target;
                    ID =                $(element).parent().parent().find('.rowNumber').attr('value');
                    CandidatID =        $(element).parent().parent().find('.Candidat').attr('value');
                    var CandidatName =  $(element).parent().parent().find('.Candidat').html();
                    var WhoEdited =     $(element).parent().parent().find('.Users').html();
                    var Vacancy =       $(element).parent().parent().find('.Vacancy').html();
                    var LastEdited =    $(element).parent().parent().find('.StatusDate').html();
                    var Commentary =    $(element).parent().parent().find('.Commentary').text();
                    var StatusName = $(element).parent().parent().find('.Status').html();
                    var StatusValue = $(element).parent().parent().find('.Status').attr('value');
                    //alert(ID);
                    $('.PopUpEditHiringWindow').find('.CandidatName').html("Candidat Name: " + CandidatName);
                    $('.PopUpEditHiringWindow').find('.CandidatEditedBy').html("EditedBy: " + WhoEdited);
                    $('.PopUpEditHiringWindow').find('.CandidatSelectedVacancy').html("Selected Vacancy: " + Vacancy);
                    $('.PopUpEditHiringWindow').find('.CandidatLastEdit').html("Last Edited Date: " + LastEdited);
                    $('.PopUpEditHiringWindow').find('#CandidatStatus').val(StatusName);
                    $('.PopUpEditHiringWindow').find('#CandidatStatus').val(StatusValue);
                    $('.PopUpEditHiringWindow').find('#HiringDesc').text(Commentary.replace("...edit", ""));

                    $('.PopUpEditHiringWindow').find('#DeleteHiringButton').on('click', function () {

                        $.ajax({
                            method: "POST",
                            url: "/AdminPanel.html/" + target + "/DeleteCandidat",
                            data: {
                                ID: ID,
                            },
                            dataType: 'json',
                        }).always(function () {
                            $.ajax({
                                method: "GET",
                                url: "/AdminPanel.html/" + target,
                                data:
                                {
                                    action: "GetComponents",
                                    target: target
                                },
                                dataType: 'json',
                                success: function (data) {
                                    GetHiring(data);
                                }
                            });
                        });
                        $('.PopUpEditHiringWindow-Behind').hide();
                        $('.PopUpCandidatInfoWindow').hide();
                    });

                    $('.PopUpEditHiringWindow').find('#ShowCandidatInfo').hover(function () {

                        var CandidatInfo = $('.PopUpEditHiringWindow-Behind').find('.PopUpCandidatInfoWindow');
                        CandidatInfo.show();
                        $.ajax({
                            method: "POST",
                            url: "/AdminPanel.html/" + target + "/GetCandidat",
                            data: {
                                ID: CandidatID,
                            },
                            dataType: 'json',
                            success: function (data) {
                                CandidatInfo.find(".CandidatNameWithSurname").html("Candidat Name: " + data.FirstName + " " + data.LastName);
                                CandidatInfo.find(".CandidatEmail").html("Email: " + data.Email);
                                CandidatInfo.find(".CandidatPhone").html("Phone: " + data.Phone);
                                //GetVacancy(data);
                            }
                        });
                    },
                        function () {
                            var CandidatInfo = $('.PopUpEditHiringWindow-Behind').find('.PopUpCandidatInfoWindow');
                            CandidatInfo.hide();
                        }
                    );

                    //$('.PopUpEditHiringWindow').find('#ShowCandidatCV').on('click', function () {
                    //    $.ajax({
                    //        method: 'POST',
                    //        url: '/AdminPanel.html/' + target + '/GetCV',
                    //        data: {
                    //            ID: CandidatID,
                    //        },
                    //        dataType: 'json',
                    //        success: function (data) {

                    //        }
                    //    });
                    //});

                    $('.PopUpEditHiringWindow').find('#CandidatStatus').hover(function () {

                        $(this).html($(this).val());
                        switch ($(this).val()) {
                            case "New":
                                $(this).css('background-color', 'blue');
                                break;
                            case "Archieved":
                                $(this).css('background-color', 'yellow');
                                break;
                            case "Rejected":
                                $(this).css('background-color', 'red');
                                break;
                            case "Hired":
                                $(this).css('background-color', 'green');
                                break;
                            default:
                                $(this).css('background-color', 'lightgreen');
                                break;
                        }
                    }, function () {
                        $(this).html('Status');
                        //$('.PopUpEditHiringWindow').find('#CandidatStatus').style('background-color', 'limegreen');
                        $(this).css('background-color', 'lightgreen');
                    });

                    $('.PopUpEditHiringWindow-Behind').show();
                    $('.PopUpCandidatInfoWindow').hide();
                });
                $('#ShowCandidatInfo').on('click', function () {
                    //alert(ID);
                    $('.PopUpCandidatInfoWindow').show();
                });

                $('#ExitFromHiringWindow').on('click', function () {
                    $('.PopUpEditHiringWindow-Behind').hide();
                    $('.PopUpCandidatInfoWindow').hide();
                });

                $('#ExitFromCandidatInfoWindow').on('click', function () {
                    $('.PopUpCandidatInfoWindow').hide();
                });

                $('.PopUpEditHiringWindow-Behind').on('mousedown', function (e) {
                    if (!(($(e.target).closest(".PopUpEditHiringWindow").length > 0) || ($(e.target).closest("#ExitFromHiringWindow").length > 0) || ($(e.target).closest(".PopUpCandidatInfoWindow").length > 0))) {
                        $('.PopUpEditHiringWindow-Behind').hide();
                    }
                });

                $('.editFromUsersTable').on('click', function (event) {
                    var element = event.target;
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
                    var UserFirstName = $(element).parent().parent().find('.FirstName').text();
                    var UserLastName = $(element).parent().parent().find('.LastName').text();
                    var UserUsername = $(element).parent().parent().find('.Username').text();
                    var UserPassword = $(element).parent().parent().find('.Password').text();
                    var UserEmail = $(element).parent().parent().find('.Email').text();
                    //var UserEndDate = $(element).parent().parent().find('.EndDate').text();

                    $('.PopUpEditUserWindow').find('#UserFirstName').val(UserFirstName);
                    $('.PopUpEditUserWindow').find('#UserLastName').val(UserLastName);
                    $('.PopUpEditUserWindow').find('#UserUsername').val(UserUsername);
                    $('.PopUpEditUserWindow').find('#UserPassword').val(UserPassword);
                    $('.PopUpEditUserWindow').find('#UserEmail').val(UserEmail);
                    //$('.PopUpEditUserWindow').find('#UserEndDate').val(UserEndDate.replace("...edit", ""));

                    $('.PopUpEditUserWindow').find('.PopUpEditUserWindow').find('#DeleteUserButton').on('click', function () {

                        $.ajax({
                            method: "POST",
                            url: "/AdminPanel.html/" + target + "/DeleteUser",
                            data: {
                                ID: ID,
                            },
                            dataType: 'json',
                        }).always(function () {
                            $.ajax({
                                method: "GET",
                                url: "/AdminPanel.html/" + target,
                                data:
                                {
                                    action: "GetComponents",
                                    target: target
                                },
                                dataType: 'json',
                                success: function (data) {
                                    GetUsers(data);
                                }
                            });
                        });
                        $('.PopUpEditUserWindow-Behind').hide();
                    });

                    $('.PopUpEditUserWindow').find('#EditUserButton').on('click', function () {
                        var a = "adsa0";
                        $.ajax({
                            method: "POST",
                            url: "/AdminPanel.html/" + target + "/EditUser",
                            data:
                            {
                                ID: ID,
                                UserFirstName: $('.PopUpEditUserWindow').find('#UserFirstName').val(),
                                UserLastName: $('.PopUpEditUserWindow').find('#UserLastName').val(),
                                UserUsername: $('.PopUpEditUserWindow').find('#UserUsername').val(),
                                UserPassword: $('.PopUpEditUserWindow').find('#UserPassword').val(),
                                UserEmail: $('.PopUpEditUserWindow').find('#UserEmail').val(),
                                //UserEndDate: $('.PopUpEditUserWindow').find('#UserEndDate').val()
                            },
                            dataType: 'json'
                        }).always(function () {
                            $.ajax({
                                method: "GET",
                                url: "/AdminPanel.html/GetUsers",
                                data:
                                {
                                    action: "GetComponents",
                                },
                                dataType: 'json',
                                success: function (data) {
                                    GetUsers(data);
                                }
                            });
                        }); // end ajax
                        $('.PopUpEditUserWindow-Behind').hide();
                    });

                    $('.PopUpEditUserWindow-Behind').show();


                    //alert(ID);
                });

                $('.PopUpEditUserWindow-Behind').on('mousedown', function (e) {
                    if (!(($(e.target).closest(".PopUpEditUserWindow").length > 0) )) {
                        $('.PopUpEditUserWindow-Behind').hide();
                    }
                });

                $('.editFromEmployeesTable').on('click', function () {
                    var element = event.target;
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
                    var EmployeeFirstName = $(element).parent().parent().find('.FirstName').text();
                    var EmployeeLastName = $(element).parent().parent().find('.LastName').text();
                    var EmployeePhone = $(element).parent().parent().find('.Phone').text();
                    var EmployeeEmail = $(element).parent().parent().find('.Email').text();
                    var EmployeeDepartment = $(element).parent().parent().find('.Department').text();

                    $('.PopUpEditEmployeeWindow').find('#EmployeeFirstName').val(EmployeeFirstName);
                    $('.PopUpEditEmployeeWindow').find('#EmployeeLastName').val(EmployeeLastName);
                    $('.PopUpEditEmployeeWindow').find('#EmployeePhone').val(EmployeePhone);
                    $('.PopUpEditEmployeeWindow').find('#EmployeeEmail').val(EmployeeEmail);
                    $('.PopUpEditEmployeeWindow').find('#EmployeeDepartment').val(EmployeeDepartment);

                    

                    $('.PopUpEditEmployeeWindow').find('#DeleteEmployeeButton').on('click', function () {

                        $.ajax({
                            method: "POST",
                            url: "/AdminPanel.html/" + target + "/DeleteEmployee",
                            data: {
                                ID: ID,
                            },
                            dataType: 'json',
                        }).always(function () {
                            $.ajax({
                                method: "GET",
                                url: "/AdminPanel.html/" + target,
                                data:
                                {
                                    action: "GetComponents",
                                    target: target
                                },
                                dataType: 'json',
                                success: function (data) {
                                    GetEmployees(data);
                                }
                            });
                        });
                        $('.PopUpEditEmployeeWindow-Behind').hide();
                    });

                    $('.PopUpEditEmployeeWindow').find('#EditEmployeeButton').on('click', function () {
                        var a = "adsa0";
                        $.ajax({
                            method: "POST",
                            url: "/AdminPanel.html/" + target + "/EditEmployee",
                            data:
                            {
                                ID: ID,
                                EmployeeFirstName: $('.PopUpEditEmployeeWindow').find('#EmployeeFirstName').val(),
                                EmployeeLastName: $('.PopUpEditEmployeeWindow').find('#EmployeeLastName').val(),
                                EmployeePhone: $('.PopUpEditEmployeeWindow').find('#EmployeePhone').val(),
                                EmployeeDepartment: $('.PopUpEditEmployeeWindow').find('#EmployeeDepartment').val(),
                                EmployeeEmail: $('.PopUpEditEmployeeWindow').find('#EmployeeEmail').val(),
                            },
                            dataType: 'json'
                        }).always(function () {
                            $.ajax({
                                method: "GET",
                                url: "/AdminPanel.html/GetEmployees",
                                data:
                                {
                                    action: "GetComponents",
                                },
                                dataType: 'json',
                                success: function (data) {
                                    GetEmployees(data);
                                }
                            });
                        }); // end ajax
                        $('.PopUpEditEmployeeWindow-Behind').hide();
                    });

                    $('.PopUpEditEmployeeWindow-Behind').show();
                });


                $('.PopUpEditEmployeeWindow-Behind').on('mousedown', function (e) {
                    if (!(($(e.target).closest(".PopUpEditUserWindow").length > 0))) {
                        $('.PopUpEditUserWindow-Behind').hide();
                    }
                });

                $('.editFromDictionaryTable').on('click', function () {
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
                    //alert(ID);
                });
            }//end success



        });
        // end ajax function

    });
    //window.location.("/AdminPanel.html/GetVacancy")

    //#region Work with vacancies table // Add, Edit, Delete, 

    $('#EditVacancyButton').on('click', function () {
        $('.PopUpAddVacancyWindow-Behind').hide();
        $.ajax({
            method: "POST",
            url: "/AdminPanel.html/" + target + "/EditVacancy",
            data:
            {
                ID: ID,
                Title: $('#VacTitle').val(),
                Description: $('#VacancyDesc').val()
            },
            dataType: 'json'

        }).always(function () {
            $.ajax({
                method: "GET",
                url: "/AdminPanel.html/GetVacancy",
                data:
                {
                    action: "GetComponents",
                },
                dataType: 'json',
                success: function (data) {
                    GetVacancy(data);
                }
            });
        }); // end ajax
        //window.location.replace("/AdminPanel.html");
    }); // End edit button

    $('#DeleteVacancyButton').on('click', function () {
        $('.PopUpAddVacancyWindow-Behind').hide();
        $.ajax({
            method: "POST",
            url: "/AdminPanel.html/ " + target + "/DeleteVacancy",
            data:
            {
                ID: ID
            },
            dataType: 'json'
        }).always(function () {
            $.ajax({
                method: "GET",
                url: "/AdminPanel.html/GetVacancy",
                data:
                {
                    action: "GetComponents",
                },
                dataType: 'json',
                success: function (data) {
                    GetVacancy(data);
                }
            });
        }); // end ajax
    });// End delete function

    $('#ExitFromVacancyWindow').on('click', function () {
        $('.PopUpAddVacancyWindow-Behind').hide();
    });

    $('.PopUpAddVacancyWindow-Behind').on('mousedown', function (e) {
        if (!(($(e.target).closest(".PopUpAddVacancyWindow").length > 0) || ($(e.target).closest("#ExitFromVacancyWindow").length > 0))) {
            $('.PopUpAddVacancyWindow-Behind').hide();
        }
    });



    $(".VacanciesTable").on('click', function (e) {
        var element = e.target;
        if (e.target.matches('.editFromVacancyTable')) {
            $('.PopUpAddVacancyWindow-Behind').show();
            $('#AddVacancyButton').hide();
            $('#EditVacancyButton').show();
            $('#DeleteVacancyButton').show();
            ID = $(e.target).parent().parent().find('.rowNumber').attr('value');
            //alert(ID);
            $.ajax({
                method: "POST",
                url: "/AdminPanel.html/" + target + "/EditVacancyMenu",
                data:
                {
                    ID: ID
                },
                dataType: 'json',
                success: function (data) {
                    $(data).each(function (index, data) {
                        $('#SelectModel').val('');
                        $('#VacTitle').val(data.VacancyTitle);
                        $('#VacancyDesc').val(data.VacancyDescription);
                    });
                }// end success
            }); // end ajax

        }
    });



    $('#AddVacancyButton').on('click', function () {
        $('.PopUpAddVacancyWindow-Behind').hide();
        $.ajax({
            method: "POST",
            url: "/AdminPanel.html/ " + target + "/SetNewVacancy",
            data:
            {
                Title: $('#VacTitle').val(),
                Description: $('#VacancyDesc').val()
            },
            dataType: 'json'
        }) // end ajax
        window.location.reload();
    }); // End add button

    $('.addVacancies').on('click', function () {
        $('.PopUpAddVacancyWindow-Behind').show();
        $('#AddVacancyButton').show();
        $('#EditVacancyButton').hide();
        $('#DeleteVacancyButton').hide();
    });



    $('.PopUpAddUserWindow-Behind').on('mousedown', function (e) {
        if (!(($(e.target).closest(".PopUpAddUserWindow").length > 0))) {
            $('.PopUpAddUserWindow-Behind').hide();
        }
    });


    $('#SelectModel').change(function () {
        if ($('#SelectModel').val() === "Custom Model" || $('#SelectModel').val() === "Select Model...") {
            //$('#VacTitle').removeAttr('readonly', 'readonly');
            //$('#VacancyDesc').removeAttr('readonly', 'readonly');
            $('#VacTitle').val('');
            $('#VacancyDesc').val('');
        } else {
            $.ajax({
                method: "POST",
                url: "/AdminPanel.html/" + target + "/getVacancyV",
                data:
                {
                    Title: $('#SelectModel').val()
                },
                dataType: 'json',
                success: function (data) {
                    $(data).each(function (index, data) {
                        $('#VacTitle').val(data.Title);
                        //$('#VacTitle').attr('readonly', 'readonly');
                        $('#VacancyDesc').val(data.Description);
                        //$('#VacancyDesc').attr('readonly', 'readonly');
                    });
                }// end success
            }) // end ajax
        }
    }); // end selectModel change function
    //$('.PopUpAddVacancyWindow-Behind').on(click, function () {
    //    $('.PopUpAddVacancyWindow-Behind').hide();
    //})
    //#endregion
    $('#CandidatStatus').on('click', function () {
        var status = GetNextStatus($('#CandidatStatus').val());
        $('#CandidatStatus').val(status);
        $('#CandidatStatus').text(status);
        switch ($('#CandidatStatus').val()) {
            case "New":
                $('#CandidatStatus').css('background-color', 'blue');
                break;
            case "Archieved":
                $('#CandidatStatus').css('background-color', 'yellow');
                break;
            case "Rejected":
                $('#CandidatStatus').css('background-color', 'red');
                break;
            case "Hired":
                $('#CandidatStatus').css('background-color', 'green');
                break;
            default:
                $('#CandidatStatus').css('background-color', 'lightgreen');
                break;
        }
    });




    $(".HiringTable").on('click', function (e) {
        var element = e.target;
        if (e.target.matches('.editFromHiringTable')) {
            ID = $(element).parent().parent().find('.rowNumber').attr('value');
            CandidatID = $(element).parent().parent().find('.Candidat').attr('value');
            var CandidatName = $(element).parent().parent().find('.Candidat').html();
            var WhoEdited = $(element).parent().parent().find('.Users').html();
            var Vacancy = $(element).parent().parent().find('.Vacancy').html();
            var LastEdited = $(element).parent().parent().find('.StatusDate').html();
            var Commentary = $(element).parent().parent().find('.Commentary').text();
            var StatusName = $(element).parent().parent().find('.Status').html();
            var StatusValue = $(element).parent().parent().find('.Status').attr('value');
            //alert(ID);
            $('.PopUpEditHiringWindow').find('.CandidatName').html("Candidat Name: " + CandidatName);
            $('.PopUpEditHiringWindow').find('.CandidatEditedBy').html("EditedBy: " + WhoEdited);
            $('.PopUpEditHiringWindow').find('.CandidatSelectedVacancy').html("Selected Vacancy: " + Vacancy);
            $('.PopUpEditHiringWindow').find('.CandidatLastEdit').html("Last Edited Date: " + LastEdited);
            $('.PopUpEditHiringWindow').find('#CandidatStatus').val(StatusName);
            $('#ShowCandidatCV').find('#DownloadCV').attr('download', StatusValue);
            $('.PopUpEditHiringWindow').find('#CandidatStatus').val(StatusValue);
            $('.PopUpEditHiringWindow').find('#HiringDesc').text(Commentary.replace("...edit", ""));

            $('.PopUpEditHiringWindow').find('#DeleteHiringButton').on('click', function () {

                $.ajax({
                    method: "POST",
                    url: "/AdminPanel.html/" + target + "/DeleteCandidat",
                    data: {
                        ID: ID,
                    },
                    dataType: 'json',
                }).always(function () {
                    $.ajax({
                        method: "GET",
                        url: "/AdminPanel.html/" + target,
                        data:
                        {
                            action: "GetComponents",
                            target: target
                        },
                        dataType: 'json',
                        success: function (data) {
                            GetHiring(data);
                        }
                    });
                });
                $('.PopUpEditHiringWindow-Behind').hide();
                $('.PopUpCandidatInfoWindow').hide();
            });

            $('.PopUpEditHiringWindow').find('#ShowCandidatInfo').hover(function () {

                var CandidatInfo = $('.PopUpEditHiringWindow-Behind').find('.PopUpCandidatInfoWindow');
                CandidatInfo.show();
                $.ajax({
                    method: "POST",
                    url: "/AdminPanel.html/" + target + "/GetCandidat",
                    data: {
                        ID: CandidatID,
                    },
                    dataType: 'json',
                    success: function (data) {
                        CandidatInfo.find(".CandidatNameWithSurname").html("Candidat Name: " + data.FirstName + " " + data.LastName);
                        CandidatInfo.find(".CandidatEmail").html("Email: " + data.Email);
                        CandidatInfo.find(".CandidatPhone").html("Phone: " + data.Phone);
                        //GetVacancy(data);
                    }
                });
            },
                function () {
                    var CandidatInfo = $('.PopUpEditHiringWindow-Behind').find('.PopUpCandidatInfoWindow');
                    CandidatInfo.hide();
                }
            );

            $('.PopUpEditHiringWindow').find('#ShowCandidatCV').on('click', function () {
                //$('#ShowCandidatCV').find('#DownloadCV').attr('Download', StatusValue);

                //$.ajax({
                //    method: 'POST',
                //    url: '/AdminPanel.html/' + target + '/GetCV',
                //    data: {
                //        ID: CandidatID,
                //    },
                //    dataType: 'json',
                //    success: function (data) {

                //    }
                //});
            });

            $('.PopUpEditHiringWindow').find('#CandidatStatus').hover(function () {

                $(this).html($(this).val());
                switch ($(this).val()) {
                    case "New":
                        $(this).css('background-color', 'blue');
                        break;
                    case "Archieved":
                        $(this).css('background-color', 'yellow');
                        break;
                    case "Rejected":
                        $(this).css('background-color', 'red');
                        break;
                    case "Hired":
                        $(this).css('background-color', 'green');
                        break;
                    default:
                        $(this).css('background-color', 'lightgreen');
                        break;
                }
            }, function () {
                $(this).html('Status');
                //$('.PopUpEditHiringWindow').find('#CandidatStatus').style('background-color', 'limegreen');
                $(this).css('background-color', 'lightgreen');
            });



            $('.PopUpEditHiringWindow-Behind').show();
            $('.PopUpCandidatInfoWindow').hide();
            //alert(ID);
            $.ajax({
                method: "POST",
                url: "/AdminPanel.html/" + target + "/EditHiringMenu",
                data:
                {
                    ID: ID
                },
                dataType: 'json',
                success: function (data) {
                    $(data).each(function (index, data) {
                        $('.CandidatName').val(data.HiringCandidat);
                        $('.CandidatEditedBy').val(data.HiringUsers);
                        $('.CandidatSelectedVacancy').val(data.HiringVacancy);
                        $('.CandidatLastEdit').val(data.HiringStatusDate);
                        $('#CandidatStatus').val(data.HiringStatus);
                        $('#HiringDesc').val(data.HiringComm);
                    });
                }// end success
            }); // end ajax

        }
    });

    $('#EditHiringButton').on('click', function () {
        var a = $('#CandidatStatus').val();
        $.ajax({
            method: "POST",
            url: "/AdminPanel.html/" + target + "/EditHiring",
            data:
            {
                ID: ID,
                CandidatID: CandidatID,
                Status: $('#CandidatStatus').val(),
                Description: $('#HiringDesc').val()
            },
            dataType: 'json'
        }).always(function () {
            $.ajax({
                method: "GET",
                url: "/AdminPanel.html/GetHiring",
                data:
                {
                    action: "GetComponents",
                },
                dataType: 'json',
                success: function (data) {
                    GetHiring(data);
                }
            });
        }); // end ajax
        $('.PopUpEditHiringWindow-Behind').hide();
    });

    $(".UsersTable").on('click', function (e) {
    $('.addUser').on('click', function () {
        $('.PopUpAddUserWindow-Behind').show();
        $('#AddUserButton').show();
        $('#EditUserButton').hide();
        $('#DeleteUserButton').hide();
        $('#SelectUserModel').empty();
        $('#SelectUserModel').append('<option selected>Select User...</option>');
        $.ajax({
            method: "POST",
            url: "/AdminPanel.html/" + target + "/getCandidats",
            data: "data",
            dataType: 'json',
            success: function (data) {
                $(data).each(function (index, num) {

                    $('#SelectUserModel').append('<option value="' + num.Id + '">' + num.FirstName + " " + num.LastName + '</option>');
                })
            }
        });
    });


    $(".EmployeesTable").on('click', function (e) {
        var element = e.target;
        if (e.target.matches('.editFromUsersTable')) {
            ID = $(element).parent().parent().find('.rowNumber').attr('value');
            var EmployeeFirstName = $(element).parent().parent().find('.FirstName').text();
            var EmployeeLastName = $(element).parent().parent().find('.LastName').text();
            var EmployeePhone = $(element).parent().parent().find('.Phone').text();
            var EmployeeEmail = $(element).parent().parent().find('.Email').text();
            var EmployeeDepartment = $(element).parent().parent().find('.Department').text();

            $('.PopUpEditEmployeeWindow').find('#EmployeeFirstName').val(EmployeeFirstName);
            $('.PopUpEditEmployeeWindow').find('#EmployeeLastName').val(EmployeeLastName);
            $('.PopUpEditEmployeeWindow').find('#EmployeePhone').val(EmployeePhone);
            $('.PopUpEditEmployeeWindow').find('#EmployeeEmail').val(EmployeeEmail);
            $('.PopUpEditEmployeeWindow').find('#EmployeeDepartment').val(EmployeeDepartment);



            $('.PopUpEditEmployeeWindow').find('#DeleteEmployeeButton').on('click', function () {

                $.ajax({
                    method: "POST",
                    url: "/AdminPanel.html/" + target + "/DeleteEmployee",
                    data: {
                        ID: ID,
                    },
                    dataType: 'json',
                }).always(function () {
                    $.ajax({
                        method: "GET",
                        url: "/AdminPanel.html/" + target,
                        data:
                        {
                            action: "GetComponents",
                            target: target
                        },
                        dataType: 'json',
                        success: function (data) {
                            GetEmployees(data);
                        }
                    });
                });
                $('.PopUpEditEmployeeWindow-Behind').hide();
            });

            $('.PopUpEditEmployeeWindow').find('#EditEmployeeButton').on('click', function () {
                var a = "adsa0";
                $.ajax({
                    method: "POST",
                    url: "/AdminPanel.html/" + target + "/EditEmployee",
                    data:
                    {
                        ID: ID,
                        EmployeeFirstName: $('.PopUpEditEmployeeWindow').find('#EmployeeFirstName').val(),
                        EmployeeLastName: $('.PopUpEditEmployeeWindow').find('#EmployeeLastName').val(),
                        EmployeePhone: $('.PopUpEditEmployeeWindow').find('#EmployeePhone').val(),
                        EmployeeDepartment: $('.PopUpEditEmployeeWindow').find('#EmployeeDepartment').val(),
                        EmployeeEmail: $('.PopUpEditEmployeeWindow').find('#EmployeeEmail').val(),
                    },
                    dataType: 'json'
                }).always(function () {
                    $.ajax({
                        method: "GET",
                        url: "/AdminPanel.html/GetEmployees",
                        data:
                        {
                            action: "GetComponents",
                        },
                        dataType: 'json',
                        success: function (data) {
                            GetEmployees(data);
                        }
                    });
                }); // end ajax
                $('.PopUpEditEmployeeWindow-Behind').hide();
            });

            $('.PopUpEditEmployeeWindow-Behind').show();
            //alert(ID);
            $.ajax({
                method: "POST",
                url: "/AdminPanel.html/" + target + "/EditEmployeeMenu",
                data:
                {
                    ID: ID
                },
                dataType: 'json',
                success: function (data) {
                    $(data).each(function (index, data) {
                        $('#EmployeeFirstName').val(data.FirstName);
                        $('#EmployeeLastName').val(data.LastName);
                        $('#EmployeePhone').val(data.Phone);
                        $('#EmployeeDepartment').val(data.Department);
                        $('#EmployeeEmail').val(data.Email);
                    });
                }// end success
            }); // end ajax
        }
    });
    

    $('#SelectUserModel').change(function () {
        if ($('#SelectUserModel').val() === "Custom Model" || $('#SelectUserModel').val() === "Select User...") {
            //$('#VacTitle').removeAttr('readonly', 'readonly');
            //$('#VacancyDesc').removeAttr('readonly', 'readonly');
            $('#User-FirstName').val('');
            $('#User-LastName').val('');
        } else {
            $.ajax({
                method: "POST",
                url: "/AdminPanel.html/" + target + "/getSelectedCandidat",
                data:
                {
                    ID: $('#SelectUserModel').find(':selected').val()
                },
                dataType: 'json',
                success: function (data) {
                    $(data).each(function (index, data) {
                        $('#User-FirstName').html(data.FirstName);
                        //$('#VacTitle').attr('readonly', 'readonly');
                        $('#User-LastName').html(data.LastName);
                        //$('#VacancyDesc').attr('readonly', 'readonly');
                    });
                }// end success
            }) // end ajax
        }
    }); // end selectModel change function

    $('#AddUserButton').on('click', function () {

        $.ajax({
            method: "POST",
            url: "/AdminPanel.html/" + target + "/SetNewUser",
            data:
            {
                FirstName: $('#User-FirstName').val(),
                LastName: $('#User-LastName').val(),
                Username: $('#UserName').val(),
                Password: $('#UserPass').val()
            },
            dataType: 'json'
        }).always(function () {
            $('.PopUpAddUserWindow-Behind').hide();
            $.ajax({
                method: "GET",
                url: "/AdminPanel.html/GetUsers",
                data:
                {
                    action: "GetComponents",
                },
                dataType: 'json',
                success: function (data) {
                    GetUsers(data);
                }
            });
        });
    });



    $.ajax({
        method: "GET",
        url: "/AdminPanel.html/GetVacancy",
        data:
        {
            action: "GetComponents",
        },
        dataType: 'json',
        success: function (data) {
            GetVacancy(data);
        }
    });
});