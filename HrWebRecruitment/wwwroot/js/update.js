$(document).ready(function () {
    const DivContainer = $("#vacanciescont");
    var displayedText;

    $('.applyDone').hide();

    $.ajax({
        method: "Post",
        url: "/",
        data:
        {
            action: "showVacancies"
        },
        dataType: 'json',
        success: function (data) {
            $(data).each(function (index, data) {
                newDiv = $('<div>').addClass('vacanciesbox')
                    .appendTo(DivContainer);
                $('<h3>')
                    .addClass('PositionTitl')
                    .html(data.Title)
                    .appendTo(newDiv);
                    
                $('<p>')
                    .appendTo(newDiv);
                    //$('<div>')
                    
                    $('<div>')
                    .addClass('PositionMiniDescription')
                    .html(data.Description)
                    .attr("style", "display: none;")
                   .appendTo(newDiv);

                $('<a>')
                    .addClass('vacanciesbtn')
                    .text('Afla mai multe')
                    .attr("value", data.EndDate)
                    .appendTo(newDiv);
            });

            // $(document).on('dblclick', function (e) {
            //     if (!(($(e.target).closest(".VacanciesContent").length > 0) || ($(e.target).closest(".VacantionPosition").length > 0) || ($(e.target).closest(".CV-PlacerBody").length > 0))) {
            //         $(".VacanciesModalDetails").hide();
            //         $('.VacanciesContent').css({
            //             'float': '',
            //             'margin-left': ''
            //         });
            //         $('.CV-PlacerBody').hide();
            //         $('.applyDone').hide();
            //         $("#contact").css("display", "");
            //     }
            // });

            $('.vacanciesbtn').on('click', function () { // deschiderea meniului Vacantiei
                var title = $(this).parent().find('.PositionTitl').text();
                var desc = $(this).parent().find('.PositionMiniDescription').text();
                $('.VacanciesContent-Title').html('<h1>' + title + '</h1>');
                var date = $(this).attr("value");
                
                // var date = $(this).find('.learnMore').val();
                
                $('.VacanciesContent-EndTime').text('Deadline: ' + date);
                $('.VacanciesContent-Description').text(desc);
                
                $("#contact").css("display", "none");


                $('.VacanciesModalDetails').on('click', function (e) {
                    if (!(($(e.target).closest(".VacanciesContent").length > 0) || ($(e.target).closest(".VacantionPosition").length > 0) || ($(e.target).closest(".CV-PlacerBody").length > 0))) {
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
                

                //$(this).find()
                //alert($(this).find('.PositionTitl').text());
                // is open
                //$('.CV-PlacerBody').hide();
                //$(document).closest('.VacanciesModalDetails').show();
                //$('.VacanciesModalDetails').css('display', 'block');

                $('.VacanciesModalDetails').show();
                $('#PlaceCV').on('click', function () {
                    $('.VacanciesContent').css({
                        'float': 'left',
                        'margin-left': '200px'
                    });
                    $('.CV-PlacerBody').show();
                });
               
                $('#UploadCV').on('change', function () {
                    $('.formLabel').text($('#UploadCV').val().split('\\').pop());
                })
                $('.formSubmit').on('click', function (e) {
                    var formData = new FormData();
                    formData.append("file", $('#UploadCV')[0].files[0]);

                    //var file = $('#UploadCV')[0].files[0];
                    //e.preventDefault();
                    //if ($('.formInputName').val() === null) {
                    //    alert('Introduceti Numele');
                    //} else if ($('.formInputSurname').val() === null) {
                    //    alert('Introduceti Prenumele');
                    //} else if ($('.formInputEmail').val() === null) {
                    //    alert('Introduceti Emailul');
                    //} else if ($('.formInputPhone').val() === null) {
                    //    alert('Introduceti Telefonul');
                    //} else if (!$('.formInputName').val('') || !$('.formInputSurname').val('') || !$('.formInputEmail').val('') || !$('.formInputPhone').val('') )
                    //{
                    //formData.append("action", "setCandidat");
                    formData.append("VacancyTitle", title);

                    formData.append("Name", $('.formInputName').val());
                    formData.append("Surname", $('.formInputSurname').val());
                    formData.append("Email", $('.formInputEmail').val());
                    formData.append("Phone", $('.formInputPhone').val());

                    $.ajax({
                        type: "PUT",
                        url: "/",
                        data: formData,
                        contentType: false,
                        processData: false,
                        cache: false,

                        //{
                        //    action: "setCandidat",
                        //    VacancyTitle: title,
                        //    Name: $('.formInputName').val(),
                        //    Surname: $('.formInputSurname').val(),
                        //    Email: $('.formInputEmail').val(),
                        //    Phone: $('.formInputPhone').val(),
                        //    formData
                        //},

                        success: function (data) {
                            $('.applyDone').show();
                            $('.formInput').val('');
                            $('#UploadCV').val('');
                        }
                    });
                    //$.ajax({
                    //    method: "POST",
                    //    url: "/Handler.ashx",
                    //    data: formData,
                    //    success: function () {
                    //        $('.applyDone').show();
                    //        $('.formInput').val('');
                    //        //alert("You are applied succesfuly");
                    //        //setTimeout($(document).click(), 300000);
                    //        //$(document).click();
                    //    }
                    //});
                    //}
                    //alert(title + ' -space- ' + $('.formInputName').val() + ' --space-- ' + $('.formInputSurname').val() + '-- space --' + $('.formInputEmail').val() + ' -- space --' + $('.formInputPhone').val());
                })
                // is closed
            });
            
        }
        
    });

    //$('.learnMore').on('click', function () {
    //    alert($('.PositionTitle').text());
    //});

    $("#loginBtn").click(function () {
        $("#myModal").show();
        $("#myModal").css('display', 'block');
    });
    $("#close").click(function () {
        $("#myModal").hide();
        $("#myModal").css('display', 'none');
    });
    $(document).on('click', function (e) {
        if (!(($(e.target).closest(".modal-content").length > 0) || ($(e.target).closest("#loginBtn").length > 0))) {
            $("#myModal").hide();
        }
    });
    $('#UserLogin').on('click', function (event) {
        event.preventDefault();

        if ($("#uname").val() === "" || $("#pname").val() === "") {
            alert("Introduceti loginul sau parola");
            return false;
        }
        else {
            $.ajax({
                method: "POST",
                url: "/login",
                data:
                {
                    action: "checkUser",
                    uname: $('#uname').val(),
                    pname: $('#pname').val()
                },
                dataType: 'json',
                success: function (data) {
                    if (JSON.stringify(data) === "[]") {
                        alert('incorect username or password');
                    } else {
                        $(data).each(function (index, dat) {
                            if (dat.RoleID === "1") {
                                window.location.href = 'AdminPanel.html';
                                //$("#loginform").attr('action', 'AdminPanel.aspx');
                            } else {
                                window.location.href = 'index.html';
                                //$("#loginform").attr('action', 'Login.aspx');
                            }
                        })
                    }
                }
            });
        }
    });
})