/*----------------------------------------------------------------------
    Js Index Here
  ----------------------------------------------------------------------


----------------------------------------------------------------------*/

// steps js

$(document).ready(function () {
    let progress = 0;


    const selections = {};

    function updateProgressLine() {
        $('#progress-line').css({ 'width': progress + '%', 'height': '100%' });
        $('#progress-indicator').text(Math.round(progress) + '%').css({ 'left': `calc(${progress}% - 25px)`, 'bottom': '-40px' });
    }

    function validateStep(step) {
        let valid = true;

        $(step).find('input[required]').each(function () {
            if (!$(this).val() && $(this).is(':visible')) {
                $(this).addClass('is-invalid');
                valid = false;
            } else {
                $(this).removeClass('is-invalid');
            }
        });

        if (step.hasClass('step-2')) {
            const selectedCheckboxes = step.find('input[type="checkbox"]:checked').length;
            if (selectedCheckboxes < 1 || selectedCheckboxes > 2) {
                alert('Please select at least 1 and at most 2 checkboxes.');
                valid = false;
            }
        }

        return valid;
    }

    $(document).on('change', 'input[type="radio"], input[type="checkbox"]', function () {
        $('.service-label').removeClass('selected');
        $(this).closest('.service-label').addClass('selected');

        const step = $(this).closest('.steps').attr('class').split(' ')[1];
        const name = $(this).attr('name');
        const value = $(this).val();
        if (!selections[step]) {
            selections[step] = {};
        }
        selections[step][name] = value;
    });

    function restoreSelection(stepClass) {
        const step = selections[stepClass];
        if (step) {
            $.each(step, function (name, value) {
                $(`.${stepClass} input[name="${name}"][value="${value}"]`).prop('checked', true).trigger('change');
            });
        }
    }

    $(document).on('click', '.next-btn', function () {

        const stepsCount = $('.steps').length;
        let zipCode = document.getElementById("zipCode").value.length;
        if (zipCode < 1) {
            alert("Please enter the zip code");
            return false;
        }
        const activeStep = $(".steps.active");


        if (validateStep(activeStep)) {
            const nextStep = activeStep.next(".steps");
            if (nextStep.length) {
                if (stepsCount <= 2) {
                    progress += 10
                }
                else {
                    progress += 100 / stepsCount;
                }
                if (progress > 100) progress = 100;
                updateProgressLine();



                restoreSelection(nextStep.attr('class').split(' ')[1])


                nextStep.addClass("active");
                activeStep.removeClass("active");

                /*                 var vals = "";
                                for (var i=0, n=checkboxes.length;i<n;i++) 
                                {
                                    if (checkboxes[i].checked) 
                                    {
                                        vals += ","+checkboxes[i].value;
                                    }
                                } */


                /*  if (!nextStep.find('input[required]').val()) {
                     nextStep.find('input[required]').first().focus();
                 } */

                if (nextStep.next(".steps").length === 0) {
                    $(this).text('Completed').prop('disabled', true);
                } else {
                    $(this).text('Next').prop('disabled', false);
                }

                $('.pretstep').show();
            } else {
                progress = 100;
                updateProgressLine();
                $(this).text('Completed').prop('disabled', true);

                $('.pretstep').hide();
            }
        }
    });

    $(document).on("click", ".pretstep", function () {
        const stepsCount = $('.steps').length;
        const activeStep = $(".steps.active");

        if (activeStep.prev(".steps").length) {

            activeStep.prev(".steps").addClass("active");
            activeStep.removeClass("active");

            restoreSelection(activeStep.prev(".steps").attr('class').split(' ')[1]);

            $('.next-btn').prop('disabled', false);

            const activeStep1 = $(".step-1.active");

            if (activeStep1.length == 1) {
                progress = 0
            }
            else {
                progress -= 100 / stepsCount;
            }
            if (progress < 0) progress = 0;
            updateProgressLine();


        }
    });

    $(window).resize(function () {
        updateProgressLine();
    });






    // checkbox js

    $(document).on('change', '.desired-services .service-checkbox input[type=checkbox]', function () {

        var $label = $(this).closest('.service-checkbox').find('.service-label');

        if ($(this).is(':checked')) {
            $label.addClass('checked');
        } else {
            $label.removeClass('checked');
        }

        const countSelectval = $('.desired-services .service-checkbox input[type=checkbox]:checked').length;

        if (countSelectval > 1) {
            $('.desired-services .service-checkbox .service-label').addClass('disbled');
            $('.desired-services .service-checkbox .service-label.checked').removeClass('disbled');
        } else {
            $('.desired-services .service-checkbox .service-label').removeClass('disbled')
        }


        var serviceSelect = document.querySelectorAll('.service-checkbox input[type="checkbox"]:checked');
        var serviceSelected = [];
        for (var x = 0, l = serviceSelect.length; x < l; x++) {
            if (serviceSelect[x].value == 'windows' || serviceSelect[x].value == 'gutters') {
                serviceSelected.push(serviceSelect[x].value);
            }
        }

        document.querySelectorAll('.newstep').forEach(e => e.remove())

        if (serviceSelected.length > 1) {

            stepDataGet('http://127.0.0.1:5500/step.json', 'windows_gutter').then(function (steps) {

                let i = 2;
                for (let x in steps[0]) {

                    if (i < 2) {
                        var h2 = document.querySelectorAll('.steps.step-2')[0];
                    } else {
                        var h2 = document.querySelectorAll('.steps.step-' + i)[0];
                    }
                    i++;
                    h2.insertAdjacentHTML("afterend", '<section class="steps step-' + i + ' newstep">' + steps[0][x] + '</section>');
                }
                 for (let x in steps[1]) {

                    if (i < 2) {
                        var h2 = document.querySelectorAll('.steps.step-2')[0];
                    } else {
                        var h2 = document.querySelectorAll('.steps.step-' + i)[0];
                    }
                    i++;
                    h2.insertAdjacentHTML("afterend", '<section class="steps step-' + i + ' newstep">' + steps[1][x] + '</section>');
                }
 
            });
        }else{
            stepDataGet('http://127.0.0.1:5500/step.json', 'common').then(function (steps) {

                let i = 2;
                for (let x in steps[0]) {

                    if (i < 2) {
                        var h2 = document.querySelectorAll('.steps.step-2')[0];
                    } else {
                        var h2 = document.querySelectorAll('.steps.step-' + i)[0];
                    }
                    i++;
                    h2.insertAdjacentHTML("afterend", '<section class="steps step-' + i + ' newstep">' + steps[0][x] + '</section>');
                }
                 for (let x in steps[1]) {

                    if (i < 2) {
                        var h2 = document.querySelectorAll('.steps.step-2')[0];
                    } else {
                        var h2 = document.querySelectorAll('.steps.step-' + i)[0];
                    }
                    i++;
                    h2.insertAdjacentHTML("afterend", '<section class="steps step-' + i + ' newstep">' + steps[1][x] + '</section>');
                }
 
                selectMultiOption();
            });
        }
    });
});

// step-12 js

function selectMultiOption() {
    var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
        removeItemButton: true,
        maxItemCount: 5,
        searchResultLimit: 5,
        renderChoiceLimit: 5
    });
}

async function stepDataGet(url, unikey) {
    const response = await fetch(url);
    let jsonvale = await response.json();

    var steps = [];
    if (unikey == 'windows_gutter') {
        steps.push(jsonvale.windows_gutter[0]);
        steps.push(jsonvale.form[0]);
    }
    else {
        steps.push(jsonvale.common[0]);
        steps.push(jsonvale.form[0]);
    }

    return steps;


}