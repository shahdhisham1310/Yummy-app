/*  HTML Elements */

const offcanvas = document.getElementById("offcanvasNavbar");
const navbar = document.querySelector(".appeared-navbar");
const navbarTogglerClose = document.querySelectorAll(".close");
const navbarTogglerNormal = document.querySelectorAll(".bars");
const firstMealsPage = document.querySelector(".all-meals");
const meal = document.querySelectorAll(".meal");
const contact = document.getElementById("contact");
const categories = document.getElementById("categories");
const area = document.getElementById("area");
const ingrediants = document.getElementById("ingrediants");
const search = document.getElementById("search");
let searchPage = document.querySelector(".search-inputs");
const realNavbar = document.querySelector(".navbar");
let animated = document.querySelector(".offcanvas-body");

/* App Variables */
const baseUrl = "https://api.weatherapi.com/v1/forecast.json";
/* Functions */

//First meals page

async function getMeals() {
  const response = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s="
  );
  const { meals } = await response.json();
  displayFirstPage(meals);
}
function displayFirstPage(arr) {
  let allMeals = " ";
  for (let i = 0; i < arr.length; i++) {
    allMeals += `     <div class="col-md-3 ">
            <div class="meal position-relative overflow-hidden rounded-2" onclick="getMealDetails('${arr[i].idMeal}')" >
              <img
                src="${arr[i].strMealThumb}"
                alt=""
                width="300"
              
              />
              <div class="img-overlay text-start d-flex align-items-center text-black p-3">
              <h3>${arr[i].strMeal}</h3>
              </div>
            </div>
          </div>`;
  }
  firstMealsPage.innerHTML = allMeals;
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}

//meal details
async function getMealDetails(mealID) {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  response = await response.json();
  displayMealDetails(response.meals[0]);
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}

function displayMealDetails(meal) {
  searchPage.innerHTML = "";
  firstMealsPage.innerHTML = " ";

  let recipes = ``;
  let strTags = ``;
  let tags = meal.strTags;

  if (meal.strTags != null) {
    tags = meal.strTags.split(",");
    for (let i = 0; i < tags.length; i++) {
      strTags += `<li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
    }
  }
  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      recipes += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }
  let mealDetails = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                 <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${recipes}
                 </ul>

                 <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${strTags}
                 </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  firstMealsPage.innerHTML = mealDetails;
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}
//Search
function displaySearchPage() {
  firstMealsPage.innerHTML = " ";
  searchPage.innerHTML = `<div class="col-md-6">
            <input type="text" class="form-control" placeholder="Search By Name" id="by-name">
          </div>
          <div class="col-md-6">
            <input type="text" class="form-control" placeholder="Search By First Letter" id="by-first-letter">
          </div>
          `;
  const searchByName = document.getElementById("by-name");
  const searchByFletter = document.getElementById("by-first-letter");

  searchByName.addEventListener("input", function () {
    searchMealByName(this.value);
  });

  searchByFletter.addEventListener("input", function () {
    searchMealByLetter(this.value);
  });
}
async function searchMealByName(term) {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`
  );
  response = await response.json();

  displayFirstPage(response.meals || []);
}
async function searchMealByLetter(letter) {
  if (letter.length === 0) return;
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  response = await response.json();
  displayFirstPage(response.meals || []);
}

//Categories
async function getAllCategories() {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let response = await fetch(
    `https:/www.themealdb.com/api/json/v1/1/categories.php`
  );
  response = await response.json();
  displayAllCategories(response.categories);
}
function displayAllCategories(arr) {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let categories = ``;
  for (let i = 0; i < arr.length; i++) {
    categories += `  <div class="col-md-3 ">
            <div onclick="getMealCategory('${
              arr[i].strCategory
            }')" class="category position-relative overflow-hidden rounded-2" onclick="" >
              <img
                src="${arr[i].strCategoryThumb}"
                alt=""
                width=""
              
              />
              <div class="img-overlay   align-items-center text-black p-3">
              <h3>${arr[i].strCategory}</h3>
              <p>
              ${arr[i].strCategoryDescription.split(" ").slice(0, 20).join(" ")}
              </p>
  
              </div>
            </div>
          </div>`;
    bootstrap.Offcanvas.getInstance(offcanvas).hide();
  }
  firstMealsPage.innerHTML = categories;
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}
async function getMealCategory(category) {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  response = await response.json();
  displayFirstPage(response.meals.slice(0, 20));
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}
// Area
async function getArea() {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  response = await response.json();
  displayAreas(response.meals);
}
function displayAreas(arr) {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let Area = ``;
  for (let i = 0; i < arr.length; i++) {
    Area += `  <div class="col-md-3 ">
            <div onclick="getMealArea('${arr[i].strArea}')" class="meal-area text-center" onclick="" >
            <div class="area-icon mb-1"><i class="fa-solid fa-house-laptop "></i>
            </div>
            <h3>${arr[i].strArea}</h3>
            </div>
          </div>`;
  }
  firstMealsPage.innerHTML = Area;
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}

async function getMealArea(area) {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  response = await response.json();
  displayFirstPage(response.meals.slice(0, 20));
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}
//Ingrediants
async function getIngrediants() {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  response = await response.json();
  displayIngrediants(response.meals.slice(0, 20));
}
function displayIngrediants(arr) {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let Ingrediants = ``;
  for (let i = 0; i < arr.length; i++) {
    Ingrediants += `  <div class="col-md-3 ">
            <div onclick="getMealIngrediant('${
              arr[i].strIngredient
            }')" class="meal-area text-center" onclick="" >
            <div class="area-icon mb-1"><i class="fa-solid fa-drumstick-bite"></i>
            </div>
            <h3>${arr[i].strIngredient}</h3>
            <p>${arr[i].strDescription.split(" ").slice(0, 20).join(" ")}</p>
            </div>
          </div>`;
    bootstrap.Offcanvas.getInstance(offcanvas).hide();
  }
  firstMealsPage.innerHTML = Ingrediants;
}

async function getMealIngrediant(ingrediant) {
  firstMealsPage.innerHTML = "";
  searchPage.innerHTML = "";
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingrediant}`
  );
  response = await response.json();
  displayFirstPage(response.meals.slice(0, 20));
  bootstrap.Offcanvas.getInstance(offcanvas).hide();
}

//Contact us
function displayContactUs() {
  searchPage.innerHTML = "";
  firstMealsPage.innerHTML = `
    <form class="contact row w-75 mx-auto p-5 g-4 text-white align-items-center justify-content-center align-items-center" id="contactForm">
      <div class="col-md-6">
        <input id="nameInput" type="text" class="form-control" placeholder="Enter Your Name">
        <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">Special characters and numbers not allowed</div>
      </div>
      <div class="col-md-6">
        <input id="emailInput" type="email" class="form-control" placeholder="Enter Your Email">
        <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">Email not valid *example@yyy.zzz</div>
      </div>
      <div class="col-md-6">
        <input id="phoneInput" type="text" class="form-control" placeholder="Enter Your Phone">
        <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid Phone Number</div>
      </div>
      <div class="col-md-6">
        <input id="ageInput" type="number" class="form-control" placeholder="Enter Your Age">
        <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">Enter valid age</div>
      </div>
      <div class="col-md-6">
        <input id="passwordInput" type="password" class="form-control" placeholder="Enter Your Password">
        <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">Password must be at least 8 chars, include letters and numbers</div>
      </div>
      <div class="col-md-6">
        <input id="repasswordInput" type="password" class="form-control" placeholder="Repassword">
        <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">Passwords do not match</div>
      </div>
      <button id="submitBtn" class="btn btn-outline-danger mt-3 fit-content" type="submit" disabled>Submit</button>
    </form>
  `;

  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const ageInput = document.getElementById("ageInput");
  const passwordInput = document.getElementById("passwordInput");
  const repasswordInput = document.getElementById("repasswordInput");
  const nameAlert = document.getElementById("nameAlert");
  const emailAlert = document.getElementById("emailAlert");
  const phoneAlert = document.getElementById("phoneAlert");
  const ageAlert = document.getElementById("ageAlert");
  const passwordAlert = document.getElementById("passwordAlert");
  const repasswordAlert = document.getElementById("repasswordAlert");
  const submitBtn = document.getElementById("submitBtn");

  function validateSingleInput(input, alert, type) {
    const value = input.value.trim();
    let isValid = false;

    switch (type) {
      case "name":
        isValid = /^[a-zA-Z ]+$/.test(value);
        break;
      case "email":
        isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        break;
      case "phone":
        isValid =
          /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(
            value
          );
        break;
      case "age":
        isValid = /^(?:1?\d{1,2}|200)$/.test(value);
        break;
      case "password":
        isValid = /^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(value);
        break;
      case "repassword":
        isValid = value === passwordInput.value.trim();
        break;
    }

    if (isValid) {
      alert.classList.remove("d-block");
      alert.classList.add("d-none");
    } else {
      alert.classList.remove("d-none");
      alert.classList.add("d-block");
    }

    return isValid;
  }

  function validateAllForSubmit() {
    const allValid =
      validateSingleInput(nameInput, nameAlert, "name") &&
      validateSingleInput(emailInput, emailAlert, "email") &&
      validateSingleInput(phoneInput, phoneAlert, "phone") &&
      validateSingleInput(ageInput, ageAlert, "age") &&
      validateSingleInput(passwordInput, passwordAlert, "password") &&
      validateSingleInput(repasswordInput, repasswordAlert, "repassword");

    submitBtn.disabled = !allValid;
  }

  nameInput.addEventListener("input", function () {
    validateSingleInput(nameInput, nameAlert, "name");
    validateAllForSubmit();
  });

  emailInput.addEventListener("input", function () {
    validateSingleInput(emailInput, emailAlert, "email");
    validateAllForSubmit();
  });

  phoneInput.addEventListener("input", function () {
    validateSingleInput(phoneInput, phoneAlert, "phone");
    validateAllForSubmit();
  });

  ageInput.addEventListener("input", function () {
    validateSingleInput(ageInput, ageAlert, "age");
    validateAllForSubmit();
  });

  passwordInput.addEventListener("input", function () {
    validateSingleInput(passwordInput, passwordAlert, "password");
    validateAllForSubmit();
  });

  repasswordInput.addEventListener("input", function () {
    validateSingleInput(repasswordInput, repasswordAlert, "repassword");
    validateAllForSubmit();
  });
}

/* Events */
window.addEventListener("load", function () {
  getMeals();
});

offcanvas.addEventListener("shown.bs.offcanvas", () => {
  animated.classList.add("animated");
});

offcanvas.addEventListener("hidden.bs.offcanvas", () => {
  animated.classList.remove("animated");
});

contact.addEventListener("click", function () {
  displayContactUs();

  bootstrap.Offcanvas.getInstance(offcanvas).hide();
});
categories.addEventListener("click", function () {
  getAllCategories();

  bootstrap.Offcanvas.getInstance(offcanvas).hide();
});
area.addEventListener("click", function () {
  getArea();

  bootstrap.Offcanvas.getInstance(offcanvas).hide();
});
ingrediants.addEventListener("click", function () {
  getIngrediants();

  bootstrap.Offcanvas.getInstance(offcanvas).hide();
});
search.addEventListener("click", function () {
  displaySearchPage();

  bootstrap.Offcanvas.getInstance(offcanvas).hide();
});
