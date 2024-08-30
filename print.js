//HTML Elements
const backBtn = document.getElementById("back-btn");
const printBtn = document.getElementById("print-btn");
const propertyHeading = document.getElementById("final-property-heading");

const finalExpensesDivs = document.getElementsByClassName("final-expenses-div");
const finalRentDivs = document.getElementsByClassName("final-rent-div");
const allExpensesDivs = document.getElementsByClassName("all-expenses-div");

//LocalStorage Elements
const storedProperties = JSON.parse(localStorage.getItem("properties"));
const chosenProperty = sessionStorage.getItem("property");
let propertyIndex;

storedProperties.forEach( (property, index) => {
    if(property.name === chosenProperty) {
        propertyIndex = index;
    }
});

//Used to display name of property
const names = {
    almond: "1119 Almond St",
    germania: "429-431 Germania St",
    ross: "322 East Ross St",
    westFourth: "1261 West Fourth St",
    hepburn: "1030-1032 Hepburn St",
    memorial: "1051 Memorial Ave",
    hughes: "234-236 Hughes St",
    poplar: "915-917 Poplar St",
    sullivan: "96 Sullivan St",
    ralston: "11086 RT 14 Highway, Ralston",
    lycoming: "105 Lycoming St",
    clayton326: "326 Clayton Ave",
    clayton328: "328 Clayton Ave",
    garden: "1021 & 1021 1/2 Garden St",
};

propertyHeading.textContent = names[storedProperties[propertyIndex].name];

//Used to filter expenses into correct categories
const categories = [
    "advertising",
    "auto",
    "cleaning",
    "commissions",
    "insurance",
    "legal",
    "management",
    "mortgage",
    "interest",
    "repairs",
    "supplies",
    "taxes",
    "utilities",
    "depreciation",
    "phone"
];

const categoryTotals = {
    advertising: 0,
    auto: 0,
    cleaning: 0,
    commissions: 0,
    insurance: 0,
    legal: 0,
    management: 0,
    mortgage: 0,
    interest: 0,
    repairs: 0,
    supplies: 0,
    taxes: 0,
    utilities: 0,
    depreciation: 0,
    phone: 0
};

//Button controls
backBtn.addEventListener("click", () => {
    window.location.href = "expense.html";
});

printBtn.addEventListener("click", () => {
    window.print();
});

//Calculate expense totals for each category
storedProperties[propertyIndex].expenses.forEach(exp => {
    const category = exp.category;
    categoryTotals[category] += exp.price;
});

//Render all expense category totals
Array.from(finalExpensesDivs).forEach((categoryDiv, index) => {
    categoryDiv.querySelector("p").textContent = `$${Number(categoryTotals[categories[index]]).toFixed(2)}`;
})

//Render total value of all expenses
document.getElementById("final-total-expenses-paragraph").textContent = `$${storedProperties[propertyIndex].totalExpenses.toFixed(2)}`;

//Render all rent values
Array.from(finalRentDivs).forEach((monthDiv, index) => {
    const monthPara = monthDiv.querySelector("p");
    monthPara.textContent = `$${storedProperties[propertyIndex].rent[index].rent.toFixed(2)} | Notes: "${storedProperties[propertyIndex].rent[index].issues}"`;
});

//Render total rent value
document.getElementById("final-total-paragraph").textContent = `$${storedProperties[propertyIndex].totalRent.toFixed(2)}`;

//Render each expense into it's category div
storedProperties[propertyIndex].expenses.forEach(expense => {
    const categoryDiv = document.getElementById(`all-${expense.category}-div`);
    const price = Number(expense.price);

    const newExpense = document.createElement("h3");
    newExpense.classList.add("final-loaded-expense-div", "print");
    newExpense.textContent = `${expense.date} | "${expense.reason}" $${price.toFixed(2)}`;
    categoryDiv.appendChild(newExpense);
});