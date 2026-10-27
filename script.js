const API_URL = "http://127.0.0.1:8000";

let categoryNames = {};

function showMessage(text) {
  $("#message").text(text);
}

function loadCategories() {
  $.get(API_URL + "/categories/")
    .done(function(categories) {
      categories.forEach(function(category) {
        categoryNames[category.id] = category.name;
        $("#category-select").append(
          $("<option>").val(category.id).text(category.name)
        );
      });
      loadRecipes();
    })
    .fail(function() {
      showMessage("Не вдалося підключитися до сервера. Перевірте, що бекенд запущений на " + API_URL);
    });
}

function loadRecipes(categoryId) {
  let url = API_URL + "/recipes/";
  if (categoryId) {
    url += "?category=" + categoryId;
  }

  $.get(url)
    .done(function(recipes) {
      const list = $("#recipe-list");
      list.empty();
      showMessage("");

      if (recipes.length === 0) {
        showMessage("Рецептів не знайдено.");
        return;
      }

      recipes.forEach(function(recipe) {
        const item = $("<li>").addClass("recipe");
        item.append($("<h2>").text(recipe.title));
        item.append(
          $("<div>")
          .addClass("recipe-info")
          .text(
            (categoryNames[recipe.category_id] || "Без категорії") +
            " · " + recipe.time_minutes + " хв" +
            " · " + recipe.calories + " ккал"
          )
        );
        list.append(item);
      });
    })
    .fail(function(xhr) {
      const error = xhr.responseJSON ? xhr.responseJSON.error : "Помилка завантаження рецептів.";
      showMessage(error);
    });
}

$(document).ready(function() {
  loadCategories();

  $("#category-select").on("change", function() {
    loadRecipes($(this).val());
  });
});
