const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const mealsContainer = document.getElementById("meals");
const resultHeading = document.getElementById("result-heading");
const errorContainer = document.getElementById("error-container");
const mealDetails = document.getElementById("meal-details");
const mealDetailsContent = document.querySelector(".meal-details-content");
const backBtn = document.getElementById("back-btn");
const loader = document.getElementById("loader");

const API_KEY = "bf1fbddb9db24bb28dd0d9427eb8bb6a"; // 
const BASE_URL = "https://api.spoonacular.com/recipes/";
const SEARCH_URL = `${BASE_URL}complexSearch`;

searchBtn.addEventListener("click", searchMeals);
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchMeals();
    }
});
backBtn.addEventListener("click", () => {
    mealDetails.classList.add("hidden");
    
});
async function searchMeals() {
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) {
        showError("Please enter a search term.");
        return;
    }
    try {
        clearUI();
        showLoader();
        resultHeading.textContent = `Searching for "${searchTerm}"...`;
        const response = await fetch(
            `${SEARCH_URL}?query=${searchTerm}&number=12&apiKey=${API_KEY}`
        );
        const data = await response.json();
        hideLoader();
        if (!data.results || data.results.length === 0) {
            showError(`No recipes found for "${searchTerm}".`);
            resultHeading.textContent = "";
            return;
        }
        resultHeading.textContent = `Search results for "${searchTerm}":`;
        displayMeals(data.results);
        searchInput.value = "";

    } catch (error) {
        hideLoader();
        showError("Error fetching recipes. Please try again later.");
        console.error(error);
    }
}

function displayMeals(meals) {
    mealsContainer.innerHTML = "";
    meals.forEach(meal => {
        const mealDiv = document.createElement("div");
        mealDiv.classList.add("meal");
        mealDiv.innerHTML = `
            <img src="${meal.image}" alt="${meal.title}">
            <div class="meal-info">
                <h3>${meal.title}</h3>
                <button class="view-btn">View Recipe</button>
            </div>
        `;
        const btn = mealDiv.querySelector(".view-btn");
        btn.addEventListener("click", () => {
            getMealDetails(meal.id);
        });
        mealsContainer.appendChild(mealDiv);
    });
}
async function getMealDetails(id) {
    try {
        showLoader();
     const response = await fetch(
            `${BASE_URL}${id}/information?apiKey=${API_KEY}`
        );
      const meal = await response.json();
        hideLoader();
        mealDetailsContent.innerHTML = `
            <h2>${meal.title}</h2>
            <img src="${meal.image}" alt="${meal.title}">
            <h3>Ingredients</h3>
            <ul>
                ${meal.extendedIngredients
                    .map(item => `<li>${item.original}</li>`)
                    .join("")}
            </ul>
            <h3>Instructions</h3>
            <p>${meal.instructions || "No instructions available."}</p>
        `;
        mealDetails.classList.remove("hidden");
    } catch (error) {
        hideLoader();
        showError("Error loading recipe details.");
        console.error(error);
    }
}
function showError(message) {
    errorContainer.textContent = message;
    errorContainer.classList.remove("hidden");
}
function clearUI() {
    mealsContainer.innerHTML = "";
    errorContainer.classList.add("hidden");
}
function showLoader() {
    loader.classList.remove("hidden");
}
function hideLoader() {
    loader.classList.add("hidden");
}
