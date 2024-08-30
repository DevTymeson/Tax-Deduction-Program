window.addEventListener("DOMContentLoaded", () => {
    const propertySelect = document.getElementById("property-select");
    const categorySelect = document.getElementById("category-select");
    const reasonInput = document.getElementById("reason-input");
    const priceInput = document.getElementById("price-input");
    const dateInput = document.getElementById("date-input");
    
    //Set the date to the current year
    const currentYear = new Date().getFullYear();
    dateInput.value = `${currentYear}-01-01`;

    const submitBtn = document.getElementById("submit-expense-btn");
    const rentBtn = document.getElementById("rent-btn");
    const printBtn = document.getElementById("print-btn");
    const backupBtn = document.getElementById("backup-btn");
    const restoreBtn = document.getElementById("restore-btn");
    const backupFile = document.getElementById("backup-file");

    const expensesDiv = document.getElementById("expenses-div");

    // Default properties array to initialize if not present in localStorage
    const defaultProperties = [
        { name: "almond", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "germania", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "westFourth", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "hepburn", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "memorial", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "hughes", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "poplar", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "sullivan", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "lycoming", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "clayton326", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "clayton328", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "garden", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
        { name: "ralston", expenses: [], totalExpenses: 0, rent: [], totalRent: 0 },
    ];

    // Retrieve properties from localStorage or initialize if not present
    let storedProperties;
    try {
        storedProperties = localStorage.getItem("properties");
        if (!storedProperties) {
            localStorage.setItem("properties", JSON.stringify(defaultProperties));
            storedProperties = defaultProperties;
        } else {
            storedProperties = JSON.parse(storedProperties);
        }
    } catch (error) {
        console.error("Error parsing properties from localStorage:", error);
        localStorage.setItem("properties", JSON.stringify(defaultProperties));
        storedProperties = defaultProperties;
    }

    //Set the dropdown menu to the first item or whatever was last selected
    let selectedProperty = sessionStorage.getItem("property");

    if(selectedProperty) {
        propertySelect.value = selectedProperty;
    } else {
        propertySelect.selectedIndex = 0;
    }

    //If all fields are properly filled, adds expense to localStorage, sorts expenses by date, and reloads expenses
    submitBtn.addEventListener("click", () => {
        const property = propertySelect.value;
        const category = categorySelect.value;
        const reason = reasonInput.value;
        const price = parseFloat(priceInput.value);
        const date = dateInput.value;

        if(reason && !isNaN(price) && date) {
            storedProperties.forEach(el => {
                if(el.name === property) {
                    el.expenses.push({category: category, reason: reason, price: price, date: date});
                    el.expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
                    el.totalExpenses += price;
                    console.log(storedProperties);
                    localStorage.setItem("properties", JSON.stringify(storedProperties));
                    loadExpenses();
                    alert("Success");
                }
            });
            reasonInput.value = "";
            priceInput.value = "";
            dateInput.value = `${currentYear}-01-01`;
        } else {
            alert("Fill out all fields before submitting");
        }
    });

    //Reload the expenses when the chosen property changes
    propertySelect.addEventListener("change", () => {
        loadExpenses();
    });

    //Generate a div for each expense for the chosen property
    const loadExpenses = () => {
        expensesDiv.innerHTML = ``;
        storedProperties.forEach((el, propertyIndex) => {
            if (el.name === propertySelect.value) {
                sessionStorage.setItem("property", el.name);
                el.expenses.forEach((element, expenseIndex) => {
                    const newExpense = document.createElement("div");
                    newExpense.innerHTML = `
                        <button class="edit-expense-btn no-print" id="edit-btn-${propertyIndex}-${expenseIndex}">Edit</button>
                        <h2 id="category-${propertyIndex}-${expenseIndex}" class="printable"><span class="remove">Category: </span>${element.category}</h2>
                        <h2 id="reason-${propertyIndex}-${expenseIndex}" class="printable"><span class="remove">Reason: </span>${element.reason}</h2>
                        <h2 id="price-${propertyIndex}-${expenseIndex}" class="printable"><span class="remove">Price: </span>$${parseFloat(element.price).toFixed(2)}</h2>
                        <h2 id="date-${propertyIndex}-${expenseIndex}" class="printable"><span class="remove">Date: </span>${element.date}</h2>
                        <div class="button-div no-print" id="new-button-div-${propertyIndex}-${expenseIndex}"></div>
                    `;
                    newExpense.classList.add("loaded-expense-div", "printable", "format");
                    newExpense.id = `expense-${propertyIndex}-${expenseIndex}`;
                    expensesDiv.appendChild(newExpense);

                    document.getElementById(`edit-btn-${propertyIndex}-${expenseIndex}`).addEventListener("click", () => {
                        editExpense(propertyIndex, expenseIndex);
                    });
                });
            }
        });
    }

    //Saves original input values, prepares expense for editing by revealing new buttons and making fields changeable
    const editExpense = (propertyIndex, expenseIndex) => {
        const editButton = document.getElementById(`edit-btn-${propertyIndex}-${expenseIndex}`);
        const newButtonDiv = document.getElementById(`new-button-div-${propertyIndex}-${expenseIndex}`);

        const curCategory = document.getElementById(`category-${propertyIndex}-${expenseIndex}`);
        const curReason = document.getElementById(`reason-${propertyIndex}-${expenseIndex}`);
        const curPrice = document.getElementById(`price-${propertyIndex}-${expenseIndex}`);
        const curDate = document.getElementById(`date-${propertyIndex}-${expenseIndex}`);

        curCategoryHTML = curCategory.innerHTML;
        curReasonHTML = curReason.innerHTML;
        curPriceHTML = curPrice.innerHTML;
        curDateHTML = curDate.innerHTML;

        // Get current values from the storedProperties
        const currentCategory = storedProperties[propertyIndex].expenses[expenseIndex].category;
        const currentReason = storedProperties[propertyIndex].expenses[expenseIndex].reason;
        const currentPrice = storedProperties[propertyIndex].expenses[expenseIndex].price;
        const currentDate = storedProperties[propertyIndex].expenses[expenseIndex].date;

        // Create input fields with current values
        curCategory.innerHTML = `
            <label for='category-select-${propertyIndex}-${expenseIndex}' id='category-label' class='category-label'>
                Category:
                <select name="category" id="category-select-${propertyIndex}-${expenseIndex}" class='category-select special-label'>
                    <option value="advertising">Advertising</option>
                    <option value="auto">Auto and travel</option>
                    <option value="cleaning">Cleaning and maintenance</option>
                    <option value="commissions">Commissions</option>
                    <option value="insurance">Insurance</option>
                    <option value="legal">Legal and professional fees</option>
                    <option value="management">Management fees</option>
                    <option value="mortgage">Mortgage interest paid to banks, etc</option>
                    <option value="interest">Other interest</option>
                    <option value="repairs">Repairs</option>
                    <option value="supplies">Supplies</option>
                    <option value="taxes">Taxes</option>
                    <option value="utilities">Utilities</option>
                    <option value="depreciation">Depreciation expense or depletion</option>
                    <option value="phone">Cell Phone</option>
                </select>
            </label>
        `;
        document.getElementById(`category-select-${propertyIndex}-${expenseIndex}`).value = currentCategory;

        curReason.innerHTML = `
            <label for="reason-input-${propertyIndex}-${expenseIndex}" id='reason-label' class='reason-label'>Reason:</label>
            <input type="text" name="reason" id="reason-input-${propertyIndex}-${expenseIndex}" class='reason-input' placeholder="Ex. Toilet repair"></input>
        `;

        document.getElementById(`reason-input-${propertyIndex}-${expenseIndex}`).value = `${currentReason}`;

        curPrice.innerHTML = `
            <div class="label-align">
                <label for="price-input-${propertyIndex}-${expenseIndex}" id='price-label' class='price-label'>Price:</label>
                <input type="number" id="price-input-${propertyIndex}-${expenseIndex}" class='price-input' placeholder="$" value="${currentPrice}">
            </div>
        `;

        curDate.innerHTML = `
            <div class="label-align">
                <label for="date-input-${propertyIndex}-${expenseIndex}" id='date-label' class='date-label edit-date-label'>Date:</label>
                <input type="date" id="date-input-${propertyIndex}-${expenseIndex}" class='date-input' value="${currentDate}">
            </div>
        `;

        editButton.classList.add('hidden');
        newButtonDiv.innerHTML = '';
        newButtonDiv.style.display = "flex";
        newButtonDiv.style.justifyContent = "space-evenly";

        const deleteBtn = document.createElement("button");
        deleteBtn.innerText = "Delete";
        deleteBtn.id = `delete-btn-${propertyIndex}-${expenseIndex}`;
        deleteBtn.classList.add('edit-expense-btn');
        deleteBtn.addEventListener("click", () => deleteFunction(propertyIndex, expenseIndex));

        const cancel = document.createElement("button");
        cancel.innerText = "Cancel";
        cancel.id = `cancel-btn-${propertyIndex}-${expenseIndex}`;
        cancel.classList.add('edit-expense-btn');
        cancel.addEventListener("click", () => cancelFunction(propertyIndex, expenseIndex));

        const confirm = document.createElement("button");
        confirm.innerText = "Confirm";
        confirm.id = `confirm-btn-${propertyIndex}-${expenseIndex}`;
        confirm.classList.add('edit-expense-btn');
        confirm.addEventListener("click", () => confirmFunction(propertyIndex, expenseIndex));

        newButtonDiv.appendChild(deleteBtn);
        newButtonDiv.appendChild(cancel);
        newButtonDiv.appendChild(confirm);
    };

    //Reverts all input fields to original values and exits edit mode
    const cancelFunction = (propertyIndex, expenseIndex) => {
        const editButton = document.getElementById(`edit-btn-${propertyIndex}-${expenseIndex}`);
        const newButtonDiv = document.getElementById(`new-button-div-${propertyIndex}-${expenseIndex}`);

        const curCategory = document.getElementById(`category-${propertyIndex}-${expenseIndex}`);
        const curReason = document.getElementById(`reason-${propertyIndex}-${expenseIndex}`);
        const curPrice = document.getElementById(`price-${propertyIndex}-${expenseIndex}`);
        const curDate = document.getElementById(`date-${propertyIndex}-${expenseIndex}`);

        curCategory.innerHTML = curCategoryHTML;
        curReason.innerHTML = curReasonHTML;
        curPrice.innerHTML = curPriceHTML;
        curDate.innerHTML = curDateHTML;

        newButtonDiv.style.display = 'none';
        newButtonDiv.innerHTML = '';
        editButton.classList.remove('hidden');
    };

    //If all fields are correctly filled, saves new info the expense in localStorage
    const confirmFunction = (propertyIndex, expenseIndex) => {
        const category = document.getElementById(`category-select-${propertyIndex}-${expenseIndex}`).value;
        const reason = document.getElementById(`reason-input-${propertyIndex}-${expenseIndex}`).value;
        const price = document.getElementById(`price-input-${propertyIndex}-${expenseIndex}`).value;
        const date = document.getElementById(`date-input-${propertyIndex}-${expenseIndex}`).value;

        if (reason === "" || isNaN(price) || date === "") {
            alert("Please fill in all fields");
            return;
        }

        storedProperties[propertyIndex].expenses[expenseIndex].category = category;
        storedProperties[propertyIndex].expenses[expenseIndex].reason = reason;
        storedProperties[propertyIndex].expenses[expenseIndex].price = price;
        storedProperties[propertyIndex].expenses[expenseIndex].date = date;

        localStorage.setItem("properties", JSON.stringify(storedProperties));
        loadExpenses();
    };

    ///Removes expense from storedProperties array and reloads
    const deleteFunction = (propertyIndex, expenseIndex) => {
        if(confirm("Are you sure you want to delete this expense?")) {
            storedProperties[propertyIndex].expenses.splice(expenseIndex, 1);
            localStorage.setItem("properties", JSON.stringify(storedProperties));
            loadExpenses();
        }
    }

    //Go to the rent input screen
    rentBtn.addEventListener("click", () => {
        window.location.href = "rent.html";
    })

    //Go to the print screen
    printBtn.addEventListener("click", () => {
        window.location.href = "print.html";
    })

    //Saves localstorage data to a .txt file
    backupBtn.addEventListener("click", () => {
        const storedProperties = JSON.parse(localStorage.getItem("properties"));
        let dataStr = JSON.stringify(storedProperties, null, 2);
        let blob = new Blob([dataStr], {type: 'text/plain'});

        let link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = 'backup.txt';

        link.click();

        URL.revokeObjectURL(link.href);
    });

    //Updates localStorage to match the file uploaded
    restoreBtn.addEventListener("click", () => {
        backupFile.click();
    });

    backupFile.addEventListener("change", event => {
        let file = event.target.files[0];
        if(file) {
            let reader = new FileReader();
            reader.onload = e => {
                try {
                    let data = JSON.parse(e.target.result);
                    if (Array.isArray(data) && data.every(prop => prop.name && Array.isArray(prop.expenses))) {
                        localStorage.clear();
                        localStorage.setItem("properties", JSON.stringify(data));
                        alert("Data successfully restored!");
                    } else {
                        throw new Error("Invalid data format");
                    }
                } catch (err) {
                    alert("Failed to restore data: " + err.message);
                }
            };
            reader.readAsText(file);
        }
        loadExpenses();
    });    

    //Loads existing expenses on program open
    loadExpenses();
});