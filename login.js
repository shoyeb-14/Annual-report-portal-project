$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const email = $('#email').val().trim();
        const password = $('#password').val().trim();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }

        $.ajax({
            url: 'api/login.php',
            method: 'POST',
            data: { email, password },
            dataType: 'json',
            success: function (response) {
                if (response.status === 'success') {
                    const user = response.user;

                    // Store user info in sessionStorage
                    sessionStorage.setItem('userEmail', user.email);
                    sessionStorage.setItem('userName', user.name);
                    sessionStorage.setItem('userId', user.id);
                    sessionStorage.setItem('userRole', user.role);
                    sessionStorage.setItem('userDeptId', user.department_id);

                    // Redirect to homepage
                    window.location.href = 'index.html';
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Something went wrong. Please try again.");
            }
        });
    });
});

