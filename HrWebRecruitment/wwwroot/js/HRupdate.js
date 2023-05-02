$(document).ready(function () {
    var target = 'GetVacancy';
    var ID = 0;
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
                '<tr><td align="center" class="rowNumber" value="' + num.ID + '">' + i + '</td>'
                + '<td class="Title">' + num.Title + '</td>'
                + '<td class="Description">' + num.Description + '</td>'
                + '<td class="StartDate">' + num.StartDate + '</td>'
                + '<td class="EndDate">' + num.EndDate + '<a href="#" class="editFromVacancyTable">...edit</a></td></tr>');

            i = i + 1;
        });
        $('#SelectModel').append('<option>Custom Model</option>');
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
                '<tr><td align="center" class="rowNumber" value="' + num.ID + '">' + i + '</td>'
                + '<td class="Candidat">' + num.Candidat + '</td>'
                + '<td class="Users">' + num.Users + '</td>'
                + '<td class="Status">' + num.Status + '</td>'
                + '<td class="Vacancy">' + num.Vacancy + '</td>'
                + '<td class="StatusDate">' + num.StatusDate + '</td>'
                + '<td class="Commentary">' + num.Commentary + '<a href="#" class="editFromHiringTable">...edit</a></td></tr>')
            i = i + 1;
        });
    }
    //history.replaceState({}, false, "admin");
    $('.PopUpAddVacancyWindow-Behind').hide();
    $('.topnav .LinkToModal').on('click', function () {
        $('.WelcomeToPanel').css('display', 'none');
        $('.LinkToModal').removeClass('topNavSelected');
        $(this).addClass('topNavSelected');

        if ($('#VacanciesModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', '');
            $('.HiringTable').css('display', 'none');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', 'none');
            $('.DictionaryTable').css('display', 'none');
            $('.addVacancies').show();
            target = 'GetVacancy';
        }
        else if ($('#HiringModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', 'none');
            $('.HiringTable').css('display', '');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', 'none');
            $('.DictionaryTable').css('display', 'none');
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
            target = 'GetUsers';
        }
        else if ($('#EmployeesModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', 'none');
            $('.HiringTable').css('display', 'none');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', '');
            $('.DictionaryTable').css('display', 'none');
            $('.addVacancies').hide();
            target = 'GetEmployees';
        }
        else if ($('#DictionaryModal-btn').hasClass('topNavSelected')) {
            $('.VacanciesTable').css('display', 'none');
            $('.HiringTable').css('display', 'none');
            $('.UsersTable').css('display', 'none');
            $('.EmployeesTable').css('display', 'none');
            $('.DictionaryTable').css('display', '');
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
                                BodyTable.append(
                                    '<tr><td align="center" class="rowNumber" value="' + num.ID + '">' + i + '</td>'
                                    + '<td class="Username">' + num.Username + '</td>'
                                    + '<td class="Password">' + num.Password + '</td>'
                                    + '<td class="FirstName">' + num.FirstName + '</td>'
                                    + '<td class="LastName">' + num.LastName + '</td>'
                                    + '<td class="Email">' + num.Email + '</td>'
                                    + '<td class="RoleID">' + num.RoleID + '</td>'
                                    + '<td class="StartDate">' + num.StartDate + '</td>'
                                    + '<td class="EndDate">' + num.EndDate + '<a href="#" class="editFromUsersTable">...edit</a></td></tr>')
                                i = i + 1;
                            });
                            break;
                        }
                    case 'GetEmployees':
                        {
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
                                BodyTable.append(
                                    '<tr><td align="center" class="rowNumber" value="' + num.ID + '">' + i + '</td>'
                                    + '<td class="FirstName">' + num.FirstName + '</td>'
                                    + '<td class="LastName">' + num.LastName + '</td>'
                                    + '<td class="Phone">' + num.Phone + '</td>'
                                    + '<td class="Email">' + num.Email + '</td>'
                                    + '<td class="Department">' + num.Department + '</td>'
                                    + '<td class="Position">' + num.Position + '</td>'
                                    + '<td class="Hiring">' + num.Hiring + '</td>'
                                    + '<td class="StartDate">' + num.StartDate + '</td>'
                                    + '<td class="EndDate">' + num.EndDate + '<a href="#" class="editFromEmployeesTable">...edit</a></td></tr>')
                                i = i + 1;
                            });
                            break;
                        }
                    case 'GetDictionary':
                        {
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
                                BodyTable.append(
                                    '<tr><td align="center" class="rowNumber" value="' + num.ID + '">' + i + '</td>'
                                    + '<td class="Name">' + num.Name + '</td>'
                                    + '<td class="Type">' + num.Type + '</td>'
                                    + '<td class="Description">' + num.Description + '<a href="#" class="editFromDictionaryTable">...edit</a></td>')
                                i = i + 1;
                            });
                            break;
                        }
                }
                //$(document).on('click', function (e) {
                //    if ($(".PopUpAddVacancyWindow").hasClass("isOpen"))
                //        $('.PopUpAddVacancyWindow-Behind').removeClass("isOpen");
                //});
                //#region Work with vacancies table // Add, Edit, Delete, 
                $('.addVacancies').on('click', function () {
                    $('.PopUpAddVacancyWindow-Behind').show();
                    $('#AddVacancyButton').show();
                    $('#EditVacancyButton').hide();
                    $('#DeleteVacancyButton').hide();
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

                    }) // end ajax
                    window.location.reload();
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
                    }) // end ajax
                    window.location.reload();
                });// End delete function

                $('#ExitFromVacancyWindow').on('click', function () {
                    $('.PopUpAddVacancyWindow-Behind').hide();
                });

                $('.PopUpAddVacancyWindow-Behind').on('click', function (e) {
                    if (!(($(e.target).closest(".PopUpAddVacancyWindow").length > 0) || ($(e.target).closest("#ExitFromVacancyWindow").length > 0))) {
                        $('.PopUpAddVacancyWindow-Behind').hide();
                    }
                });

                $('.editFromVacancyTable').on('click', function () {
                    $('.PopUpAddVacancyWindow-Behind').show();
                    $('#AddVacancyButton').hide();
                    $('#EditVacancyButton').show();
                    $('#DeleteVacancyButton').show();
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
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
                                //alert(data.VacancyID);
                                //alert(data.VacancyTitle);
                                //alert(data.VacancyDescription);
                                //alert(data.VacancyEndDate);
                                $('#SelectModel').val('');
                                $('#VacTitle').val(data.VacancyTitle);
                                $('#VacancyDesc').val(data.VacancyDescription);
                            });
                        }// end success
                    }); // end ajax
                    $('.PopUpAddVacancyWindow-Behind').on('click', function (e) {
                        if (!(($(e.target).closest(".PopUpAddVacancyWindow").length > 0) || ($(e.target).closest(".VacantionPosition").length > 0) || ($(e.target).closest(".CV-PlacerBody").length > 0))) {
                            $(".VacanciesModalDetails").hide();
                            $('.VacanciesContent').css({
                                'float': '',
                                'margin-left': ''
                            });
                            $('.CV-PlacerBody').hide();
                            $('.applyDone').hide();
                            $("#contact").css("display", "");
                        }
                    });
                });


                //$('.PopUpAddVacancyWindow-Behind').on(click, function () {
                //    $('.PopUpAddVacancyWindow-Behind').hide();
                //})
                //#endregion

                $('.editFromHiringTable').on('click', function () {
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
                    //alert(ID);
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

                $('.editFromUsersTable').on('click', function () {
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
                    alert(ID);
                });
                $('.editFromEmployeesTable').on('click', function () {
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
                    alert(ID);
                });
                $('.editFromDictionaryTable').on('click', function () {
                    ID = $(this).parent().parent().find('.rowNumber').attr('value');
                    alert(ID);
                });
            }//end success



        });
        // end ajax function
    });
});