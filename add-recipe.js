requireAuth();

function loadCategoryOptions() {
  $.get(API_URL + "/categories/").done(function(categories) {
    categories.forEach(function(category) {
      $("#category_id").append($("<option>").val(category.id).text(category.name));
    });
  });
}

$(document).ready(function() {
  loadCategoryOptions();

  $("#recipe-form").on("submit", function(event) {
    event.preventDefault();
    showFieldErrors({});
    showMessage("");

    apiRequest(
      {
        url: "/recipes/",
        method: "POST",
        data: {
          title: $("#title").val(),
          description: $("#description").val(),
          time_minutes: $("#time_minutes").val(),
          calories: $("#calories").val(),
          category_id: $("#category_id").val(),
        },
      },
      function() {
        window.location.href = "index.html";
      },
      function(xhr) {
        if (xhr.status === 400 && xhr.responseJSON) {
          showMessage("Виправте помилки у формі.");
          showFieldErrors(xhr.responseJSON.details);
        } else {
          showMessage("Не вдалося додати рецепт. Спробуйте ще раз.");
        }
      }
    );
  });
});
