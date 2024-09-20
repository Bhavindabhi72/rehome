/*----------------------------------------------------------------------
Template Name: Fithub
Template URL: 
Description: Fithub - Gym and Fitness HTML Template
Author: 
Author URI: 
Version: 1.0.0
*/

/*----------------------------------------------------------------------
    Js Index Here
  ----------------------------------------------------------------------


----------------------------------------------------------------------*/

// steps js

$(document).ready(function() {
    let progress = 0;
    const stepsCount = $('.steps').length;

    const selections = {};

    function updateProgressLine() {
        $('#progress-line').css({'width': progress + '%', 'height': '100%'});
        $('#progress-indicator').text(Math.round(progress) + '%').css({'left': `calc(${progress}% - 25px)`, 'bottom': '-40px'});
    }

    function validateStep(step) {
        let valid = true;

        $(step).find('input[required]').each(function() {
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

    $(document).on('change', 'input[type="radio"], input[type="checkbox"]', function() {
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
            $.each(step, function(name, value) {
                $(`.${stepClass} input[name="${name}"][value="${value}"]`).prop('checked', true).trigger('change');
            });
        }
    }

    $(document).on('click', '.next-btn', function() {
        const activeStep = $(".steps.active");

        if (validateStep(activeStep)) {
            const nextStep = activeStep.next(".steps");
            if (nextStep.length) {
                progress += 100 / stepsCount;
                if (progress > 100) progress = 100;
                updateProgressLine();

                nextStep.addClass("active");
                activeStep.removeClass("active");

                restoreSelection(nextStep.attr('class').split(' ')[1]);

                if (!nextStep.find('input[required]').val()) {
                    nextStep.find('input[required]').first().focus();
                }

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

    $(document).on("click", ".pretstep", function() {
        const activeStep = $(".steps.active");

        if (activeStep.prev(".steps").length) {
            progress -= 100 / stepsCount;
            if (progress < 0) progress = 0;
            updateProgressLine();

            activeStep.prev(".steps").addClass("active");
            activeStep.removeClass("active");

            restoreSelection(activeStep.prev(".steps").attr('class').split(' ')[1]);

            $('.next-btn').prop('disabled', false);
        }
    });

    $(window).resize(function() {
        updateProgressLine();
    });
});





// checkbox js


$(document).ready(function() {
  $('.desired-services .service-checkbox input[type=checkbox]').change(function() {
      var $label = $(this).closest('.service-checkbox').find('.service-label');

      if ($(this).is(':checked')) {
          $label.addClass('checked');
      } else {
          $label.removeClass('checked');
      }
  });
});


// step-12 js

document.addEventListener('DOMContentLoaded', function () {
    var multipleCancelButton = new Choices('#choices-multiple-remove-button', {
        removeItemButton: true,
        maxItemCount: 5,
        searchResultLimit: 5,
        renderChoiceLimit: 5
    });
});