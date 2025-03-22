document.addEventListener("DOMContentLoaded", () => {
    const navIcon = document.querySelector(".nav-icon");
    const sidebar = document.querySelector(".sidebar");
    const closeBtn = document.querySelector(".close-btn");
    const mealList = document.getElementById("mealList");
    const searchBtn = document.getElementById("searchBtn");
    const searchInput = document.getElementById("searchInput");
    const categoriesContainer = document.getElementById("categoriesContainer");
    const mealDetails = document.getElementById("meal-details");

    // API URLs
    const categoriesAPI = "https://www.themealdb.com/api/json/v1/1/categories.php";
    const mealSearchAPI = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
    const mealDetailAPI = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";

    // Toggle sidebar
    navIcon.addEventListener("click", () => {
        sidebar.classList.add("active");
        fetchMeals();
    });

    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("active");
    });

    // Fetch meal categories for navbar
    async function fetchMeals() {
        try {
            const response = await fetch(categoriesAPI);
            const data = await response.json();
            mealList.innerHTML = "";

            data.categories.forEach((category) => {
                const listItem = document.createElement("li");
                listItem.textContent = category.strCategory;
                listItem.addEventListener("click", () => fetchMealDescription(category.strCategory));
                mealList.appendChild(listItem);
            });
        } catch (error) {
            console.error("Error fetching meals:", error);
        }
    }

    // Fetch and display meal description when clicking in navbar
    async function fetchMealDescription(category) {
        try {
            const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
            const data = await response.json();
            
            if (data.meals.length > 0) {
                const mealId = data.meals[0].idMeal;
                const mealDetailResponse = await fetch(mealDetailAPI + mealId);
                const mealDetailData = await mealDetailResponse.json();
                const mealInfo = mealDetailData.meals[0];
                
                mealDetails.innerHTML = `
                    <h2>${mealInfo.strMeal}</h2>
                    <p><strong>Description:</strong> ${mealInfo.strInstructions}</p>
                `;
                mealDetails.style.display = "block";
            }
        } catch (error) {
            console.error("Error fetching meal details:", error);
        }
    }

    // Search for meals and display images
    searchBtn.addEventListener("click", async () => {
        const query = searchInput.value.trim();
        if (query !== "") {
            try {
                const response = await fetch(mealSearchAPI + query);
                const data = await response.json();
                mealDetails.innerHTML = ""; // Clear previous results

                if (data.meals) {
                    data.meals.forEach((meal) => {
                        const mealItem = document.createElement("div");
                        mealItem.classList.add("meal-item");
                        mealItem.innerHTML = `
                            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" data-id="${meal.idMeal}">
                            <p>${meal.strMeal}</p>
                        `;
                        mealDetails.appendChild(mealItem);

                        // Click on image to fetch full meal details
                        mealItem.querySelector("img").addEventListener("click", () => {
                            fetchMealDetails(meal.idMeal);
                        });
                    });
                    mealDetails.style.display = "block";
                } else {
                    mealDetails.innerHTML = "<p>No meals found.</p>";
                }
            } catch (error) {
                console.error("Error searching meals:", error);
            }
        }
    });

    // Fetch full meal details (Ingredients, Instructions, etc.)
    async function fetchMealDetails(mealId) {
        try {
            const response = await fetch(mealDetailAPI + mealId);
            const data = await response.json();
            const mealInfo = data.meals[0];

            // Get ingredients and measurements
            let ingredientsList = "";
            for (let i = 1; i <= 20; i++) {
                const ingredient = mealInfo[`strIngredient${i}`];
                const measure = mealInfo[`strMeasure${i}`];
                if (ingredient && ingredient.trim() !== "") {
                    ingredientsList += `<li>${measure} ${ingredient}</li>`;
                }
            }

            mealDetails.innerHTML = `
                <h2>${mealInfo.strMeal}</h2>
                <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}">
                <p><strong>Category:</strong> ${mealInfo.strCategory}</p>
                <p><strong>Instructions:</strong> ${mealInfo.strInstructions}</p>
                <h3>Ingredients:</h3>
                <ul>${ingredientsList}</ul>
            `;
            mealDetails.style.display = "block";
        } catch (error) {
            console.error("Error fetching meal details:", error);
        }
    }

    // Fetch categories for homepage
    async function fetchCategories() {
        try {
            const response = await fetch(categoriesAPI);
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

    fetchCategories();
});
