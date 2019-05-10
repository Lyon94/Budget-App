// BUDGET CONTROLLER MODULE
let budgetController = (function () {

  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calculatePercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    }
  };

  Expense.prototype.getPercentage = function () {
    return this.percentage;
  };

  let calculateTotal = function (type) {
    let sum = 0;
    dataForIncExp.allIncExp[type].forEach((i) => sum += i.value);
    dataForIncExp.totalIncExp[type] = sum;
  }

  let dataForIncExp = {
    allIncExp: {
      inc: [],
      exp: []
    },
    totalIncExp: {
      inc: 0,
      exp: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function (type, description, value) {
      let id, newItem;

      // Create a new id
      if ([dataForIncExp.allIncExp[type].length] == 0) {
        id = 0;
      } else {
        id = dataForIncExp.allIncExp[type][dataForIncExp.allIncExp[type].length - 1].id + 1;
      }

      // Create a new item based on the type whether inc or exp
      if (type == "inc") {
        newItem = new Income(id, description, value);
      } else {
        newItem = new Expense(id, description, value);
      }

      // Push into the "dataForIncExp" data structure
      dataForIncExp.allIncExp[type].push(newItem);

      // Return the new item
      return newItem; // ???????????????
    },
    deleteItem: function (type, id) {
      let ids, itemIndex;

      ids = dataForIncExp.allIncExp[type].map((i) => i.id);
      itemIndex = ids.indexOf(id);
      if (itemIndex != -1) {
        dataForIncExp.allIncExp[type].splice(itemIndex, 1);
      }
      console.log(ids);
    },
    calculateBudget: function () {
      // Calculate total income and expenses
      calculateTotal("inc");
      calculateTotal("exp");

      // Calculate the budget; income - expenses
      dataForIncExp.budget = dataForIncExp.totalIncExp["inc"] - dataForIncExp.totalIncExp["exp"];

      // Calculate the percentage of income spent on expenses; 
      if (dataForIncExp.totalIncExp["inc"] > 0) {
        dataForIncExp.percentage = Math.round((dataForIncExp.totalIncExp["exp"] / dataForIncExp.totalIncExp["inc"]) * 100);
      } else {
        dataForIncExp.percentage = "- - -";
      }
    },
    calculatePercentages: function () {
      dataForIncExp.allIncExp.exp.forEach((i) => i.calculatePercentage(dataForIncExp.totalIncExp.inc));
    },
    getPercentages: function () {
      let allExpPerc = dataForIncExp.allIncExp.exp.map((i) => i.getPercentage());

      return allExpPerc;
    },
    returnBudget: function () {
      return {
        income: dataForIncExp.totalIncExp["inc"],
        expenses: dataForIncExp.totalIncExp["exp"],
        budget: dataForIncExp.budget,
        percentage: dataForIncExp.percentage
      }
    },
    test: function () {
      console.log(dataForIncExp);
    }
  };

})();


// UI CONTROLLER MODULE
let uiController = (function () {

  let domStrings = {
    type: ".add__type",
    description: ".add__description",
    value: ".add__value",
    inputButton: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    displayedBudget: ".budget__value",
    displayedIncome: ".budget__income--value",
    displayedExpenses: ".budget__expenses--value",
    displayedPercentage: ".budget__expenses--percentage",
    container: ".container",
    expPercClass: ".item__percentage",
    displayedDate: ".budget__title--month"
  };

  let formatIncExp = function (num, type) {
    var numSplit;

    num = Math.abs(num);
    num = num.toFixed(2);
    numSplit = num.split(".");
    int = numSplit[0];

    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + "," + int.substr(int.length - 3, 3)
    }
    dec = numSplit[1];

    return (type == "exp" ? "-" : "+") + " " + int + "." + dec;
  };

  let NodeListForEach = function (list, callBackFunc) {
    for (let i = 0; i < list.length; i++) {
      callBackFunc(list[i], i);
    }
  };

  return {
    getInput: function () {
      return {
        type: document.querySelector(domStrings.type).value, // returns either exp or inc
        description: document.querySelector(domStrings.description).value,
        value: parseFloat(document.querySelector(domStrings.value).value)
      };
    },
    getDomStrings: function () {
      return domStrings;
    },
    addListItem: function (obj, type) {
      let html, newHtml, element;

      // Create html string with placeholder text

      if (type == "inc") {
        element = domStrings.incomeContainer;
        html = '<div class="item clearfix" id="inc-%id%">   <div class="item__description">%description%</div>   <div class="right clearfix">   <div class="item__value">%value%</div>   <div class="item__delete">     <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>        </div>    </div>    </div>'
      } else {
        element = domStrings.expensesContainer;
        html = '  <div class="item clearfix" id="exp-%id%">    <div class="item__description">%description%</div>   <div class="right clearfix">    <div class="item__value">%value%</div>   <div class="item__percentage">21%</div>   <div class="item__delete">    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>    </div>      </div>    </div>'
      }

      //Replace placeholder string with actual data
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description", obj.description);
      newHtml = newHtml.replace("%value%", formatIncExp(obj.value, type));

      // Insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);

    },
    deleteListItem: function (itemID) {
      let itemDELT;
      itemDELT = document.getElementById(itemID);
      itemDELT.parentNode.removeChild(itemDELT);
      // console.log(itemDELT);
    },
    clearfields: function () {

      let fields, fieldArr;

      fields = document.querySelectorAll(domStrings.description + " ," + domStrings.value);

      fieldArr = Array.prototype.slice.call(fields);

      fieldArr.forEach((i) => i.value = "");

      // Change the focus back to the description box
      fieldArr[0].focus();
    },
    displayBudget: function (obj) {
      let type;
      obj.budget > 0 ? type == "inc" : type == "exp";

      document.querySelector(domStrings.displayedBudget).textContent = formatIncExp(obj.budget, type);
      document.querySelector(domStrings.displayedIncome).textContent = formatIncExp(obj.income, "inc");
      document.querySelector(domStrings.displayedExpenses).textContent = formatIncExp(obj.expenses, "exp");

      if (obj.percentage > 0) {
        document.querySelector(domStrings.displayedPercentage).textContent = obj.percentage + "%";
      } else {
        document.querySelector(domStrings.displayedPercentage).textContent = obj.percentage;
      }
    },
    displayPercentages: function (percentages) {
      let expPercList = document.querySelectorAll(domStrings.expPercClass);

      expArray = Array.prototype.slice.call(expPercList);
      expArray.forEach((value, i) => {
        if (percentages[i] > 0) {
          value.textContent = percentages[i] + "%";
        } else {
          value.textContent = "--";
        }
      })

      /*  let NodeListForEach = function (list, callBackFunc) {
         for (let i = 0; i < list.length; i++) {
           callBackFunc(list[i], i);
         }
       };

       NodeListForEach(expPercList, function (value, i) {
         if (percentages[i] > 0) {
           value.textContent = percentages[i] + "%";
         } else {
           value.textContent = "--";
         }
       }); */
    },
    displayDate: function () {
      let presentDate, months, presentMonth, presentYear;

      presentDate = new Date();

      presentYear = presentDate.getFullYear();

      months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

      presentMonth = presentDate.getMonth();

      document.querySelector(domStrings.displayedDate).textContent = months[presentMonth] + " " + presentYear;
    },
    changedType: function () {
      let fields = document.querySelectorAll(
        domStrings.type + "," +
        domStrings.description + "," +
        domStrings.value
      );

      NodeListForEach(fields, function (i) {
        i.classList.toggle("red-focus");
      });
      
      document.querySelector(domStrings.inputButton).classList.toggle("red");
    }

  };
})();


// GLOBAL App CONTROLLER ----- THE LINK
let genController = (function (bgctrl, uictrl) {

  let eventListeners = function () {
    let DOMStrings = uictrl.getDomStrings();

    document.querySelector(DOMStrings.inputButton).addEventListener("click", genCtrl);
    document.addEventListener("keypress", function (e) {
      if (e.keyCode == 13 || e.which == 13) {
        genCtrl();
      }
    });

    document.querySelector(DOMStrings.container).addEventListener("click", ctrlDeleteItem)

    document.querySelector(DOMStrings.type).addEventListener("change", uictrl.changedType);
  };

  let UpdateBudget = function () {

    // Calculate the budget
    bgctrl.calculateBudget();

    // Return the budget
    let allBudgetDetails = bgctrl.returnBudget();

    // Display the budget on the UI
    console.log(allBudgetDetails);
    uictrl.displayBudget(allBudgetDetails);
  };

  let updatePercentages = function () {
    let expPerc;

    // Calculate percentages
    bgctrl.calculatePercentages();

    // Read percentages from the budget controller
    expPerc = bgctrl.getPercentages();

    // Update the UI with the new percentage calculated
    console.log(expPerc);
    uictrl.displayPercentages(expPerc);
  };



  let genCtrl = function () {

    let input, newItem;

    // Get the field input data from the UI controller
    input = uictrl.getInput();
    console.log(input);

    if (input.description != "" && input.value > 0 && !isNaN(input.value)) {
      // Add the item to the budget controller module data structure
      newItem = bgctrl.addItem(input.type, input.description, input.value);

      // Add the item to the UI
      uictrl.addListItem(newItem, input.type);

      console.log(bgctrl.test())
      // Clear the input fields
      console.log(uictrl.clearfields());

      // Calculate and Update budget
      UpdateBudget();

      // Calculate and update new percentages
      updatePercentages();
    }
  };

  let ctrlDeleteItem = function (e) {
    let itemId, splitId, type, id;

    itemId = (e.target.parentNode.parentNode.parentNode.parentNode).id;

    if (itemId) {
      splitId = itemId.split("-");
      type = splitId[0];
      id = Number(splitId[1]);

      // Delete item from the data structure
      bgctrl.deleteItem(type, id);

      // Delete the item from the UI
      uictrl.deleteListItem(itemId);

      // Update and show the new budget
      UpdateBudget();

      // Calculate and update new percentages
      updatePercentages();

    }
  };

  return {
    init: function () {
      let initialBgtDet = function () {
        return {
          income: 0,
          expenses: 0,
          budget: 0,
          percentage: 0
        }
      };

      console.log("Application has started");
      uictrl.displayDate();
      uictrl.displayBudget(initialBgtDet());
      eventListeners();
    }
  };

})(budgetController, uiController);

genController.init();