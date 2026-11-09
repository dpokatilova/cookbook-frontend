const API_URL = "http://127.0.0.1:8000";


function showMessage(text) {
  $("#message").text(text);
}

function showFieldErrors(details) {
  $(".field-error").text("");
  for (const field in details) {
    $("#error-" + field).text(details[field].join(" "));
  }
}

function saveTokens(access, refresh) {
  localStorage.setItem("access_token", access);
  if (refresh) {
    localStorage.setItem("refresh_token", refresh);
  }
}

function getAccessToken() {
  return localStorage.getItem("access_token");
}

function getRefreshToken() {
  return localStorage.getItem("refresh_token");
}

function clearTokens() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

function isLoggedIn() {
  return getRefreshToken() !== null;
}


function currentPage() {
  const page = window.location.pathname.split("/").pop() || "index.html";
  return page + window.location.search;
}

function goToLogin() {
  window.location.href = "login.html?next=" + encodeURIComponent(currentPage());
}

function logout() {
  clearTokens();
  window.location.href = "index.html";
}


function refreshAccessToken() {
  return $.ajax({
    url: API_URL + "/users/token/refresh/",
    method: "POST",
    contentType: "application/json",
    data: JSON.stringify({ refresh: getRefreshToken() }),
  }).done(function(response) {
    saveTokens(response.access);
  });
}


function apiRequest(options, onSuccess, onError) {
  function send() {
    const token = getAccessToken();
    return $.ajax({
      url: API_URL + options.url,
      method: options.method || "GET",
      contentType: "application/json",
      data: options.data ? JSON.stringify(options.data) : undefined,
      headers: token ? { Authorization: "Bearer " + token } : {},
    });
  }

  send()
    .done(onSuccess)
    .fail(function(xhr) {
      if (xhr.status === 401 && getRefreshToken()) {
        refreshAccessToken()
          .done(function() {
            send().done(onSuccess).fail(onError);
          })
          .fail(function() {
            clearTokens();
            goToLogin();
          });
      } else if (onError) {
        onError(xhr);
      }
    });
}


function requireAuth() {
  if (!isLoggedIn()) {
    goToLogin();
  }
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = "index.html";
  }
}


function renderAuthBar() {
  const bar = $("#auth-bar");

  if (!isLoggedIn()) {
    bar.append(
      $("<a>").addClass("button").attr("href", "login.html?next=" + encodeURIComponent(currentPage())).text("Увійти")
    );
    bar.append($("<a>").addClass("button").attr("href", "register.html").text("Реєстрація"));
    return;
  }

  apiRequest({ url: "/users/me/" }, function(user) {
    bar.append($("<span>").addClass("username").text(user.first_name || user.username));
    bar.append($("<a>").addClass("button").attr("href", "add-recipe.html").text("Додати рецепт"));
    bar.append($("<button>").addClass("button").text("Вийти").on("click", logout));
  });
}

$(document).ready(function() {
  renderAuthBar();
});
