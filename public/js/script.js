// Bootstrap form validation for all forms with .needs-validation class
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission if invalid
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            // Add validation styling to show feedback
            form.classList.add('was-validated')

            // Prevent submission only if form is invalid
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }
            // If valid, form will submit normally
        }, false)
    })
})()