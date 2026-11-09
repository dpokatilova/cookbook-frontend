redirectIfLoggedIn();

function getNextPage() {
  const next = new URLSearchParams(window.location.search).get("next");
  if (!next || next.includes("//")) {
    return "index.html";
  }
  return next;
}

$(document).ready(function() {
  $("#login-form").on("submit", function(event) {
    event.preventDefault();

    $.ajax({
      url: API_URL + "/users/login/",
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify({
        username: $("#username").val(),
        password: $("#password").val(),
      }),
    })
      .done(function(response) {
        saveTokens(response.access, response.refresh);
        window.location.href = getNextPage();
      })
      .fail(function(xhr) {
        if (xhr.status === 401) {
          showMessage("Неправильне ім'я користувача або пароль.");
        } else {
          showMessage("Не вдалося увійти. Перевірте, що сервер запущений.");
        }
      });
  });
});
