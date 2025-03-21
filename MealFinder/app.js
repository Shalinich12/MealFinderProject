document.addEventListener("DOMContentLoaded", () => {
    const navIcon = document.querySelector(".nav-icon");
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector(".close-btn");
    const mealList = document.getElementById("mealList");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const categoriesContainer = document.getElementById("categoriesContainer");
    const mealDetails = document.getElementById("meal-details");

    // API URL
    const mealAPI = "https://www.themealdb.com/api/json/v1/1/categories.php";

    // Toggle sidebar
    navIcon.addEventListener("click", () => {
        sidebar.classList.add("active");
        fetchMeals();
    });

    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });

    // Fetch meal categories for sidebar
    async function fetchMeals() {
        try {
            const response = await fetch(mealAPI);
            const data = await response.json();
            mealList.innerHTML = "";

            data.categories.forEach((meal) => {
                const listItem = document.createElement("li");
                listItem.textContent = meal.strCategory;
                listItem.addEventListener("click", () => fetchMealDetails(meal.strCategory));
                mealList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    }

    // Fetch categories for home page
    async function fetchCategories() {
        try {
            const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
            const data = await response.json();
            categoriesContainer.innerHTML = "";
    
            data.categories.forEach((category) => {
                const div = document.createElement("div");
                div.classList.add("category");
                div.innerHTML = `
                    <img src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <p>${category.strCategory}</p>
                `;
                categoriesContainer.appendChild(div);
            });
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    }

    // Fetch and display meal details when clicked in sidebar
    async function fetchMealDetails(category) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();
            if (data.meals.length > 0) {
                const meal = data.meals[0];
                mealDetails.innerHTML = `
                    <h2>${meal.strMeal}</h2>
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <p>Category: ${category}</p>
                `;
                mealDetails.style.display = "block";
            }
        } catch (error) {
            console.error("Error fetching meal details:", error);
        }
    }

    // Fetch meals based on search
    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (query !== "") {
            try {
                const searchAPI = `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;
                const response = await fetch(searchAPI);
                const data = await response.json();
                
                if (data.meals) {
                    alert(`Found ${data.meals.length} meals for "${query}"`);
                } else {
                    alert("No meals found.");
                }
            } catch (error) {
                console.error("Error searching meals:", error);
            }
        }
    });

    fetchCategories();
});
