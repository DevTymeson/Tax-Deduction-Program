window.addEventListener("DOMContentLoaded", () => {
    const rentHeading = document.getElementById("heading");
    const propertyName = sessionStorage.getItem("property");
    const backBtn = document.getElementById("back-to-expense-btn");
    const saveBtn = document.getElementById("save-rent-btn");

    let storedProperties = JSON.parse(localStorage.getItem("properties"));

    const months = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

    const names = {
        almond: "1119 Almond St",
        germania: "429-431 Germania St",
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

    rentHeading.innerText = names[propertyName];

    const propertyIndex = storedProperties.findIndex((element) => element.name === propertyName);

    months.forEach( (month, index) => {
        if(storedProperties[propertyIndex]?.rent[index]) {
            document.getElementById(`${month}-rent-input`).value = storedProperties[propertyIndex].rent[index].rent;
            document.getElementById(`${month}-notes-input`).value = storedProperties[propertyIndex].rent[index].issues;
        } else {
            storedProperties[propertyIndex].rent.push({ month: month, rent: 0, issues: "" });
            document.getElementById(`${month}-rent-input`).value = 0;
        }
    })

    backBtn.addEventListener("click", () => { window.location.href = "expense.html"; });

    saveBtn.addEventListener("click", () => {
        months.forEach( (month, index) => {
            const rent = Number(document.getElementById(`${month}-rent-input`).value);
            storedProperties[propertyIndex].rent[index].rent = rent;
            storedProperties[propertyIndex].totalRent += rent;
            storedProperties[propertyIndex].rent[index].issues = document.getElementById(`${month}-notes-input`).value;
        })

        localStorage.setItem("properties", JSON.stringify(storedProperties));
        alert("Data saved");
    });
});