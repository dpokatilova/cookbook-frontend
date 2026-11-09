redirectIfLoggedIn();

$(document).ready(function() {
  $("#register-form").on("submit", function(event) {
    event.preventDefault();
    showFieldErrors({});
    showMessage("");

    $.ajax({
      url: API_URL + "/users/register/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: $("#username").val(),
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        password2: $("#password2").val(),
      }),
    })
      .done(function() {
        window.location.href = "login.html";
      })
      .fail(function(xhr) {
        if (xhr.status === 400 && xhr.responseJSON) {
          showMessage("Виправте помилки у формі.");
          showFieldErrors(xhr.responseJSON.details);
        } else {
          showMessage("Не вдалося зареєструватися. Перевірте, що сервер запущений.");
        }
      });
  });
});
