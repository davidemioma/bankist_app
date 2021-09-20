"use strict";

//Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance_value");
const labelSumIn = document.querySelector(".summary_value-in");
const labelSumOut = document.querySelector(".summary_value-out");
const labelSumInterest = document.querySelector(".summary_value-interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movement");

const btnLogin = document.querySelector(".login_btn");
const btnTransfer = document.querySelector(".form_btn-transfer");
const btnLoan = document.querySelector(".form_btn-loan");
const btnClose = document.querySelector(".form_btn-close");
const btnSort = document.querySelector(".btn_sort");

const inputLoginUsername = document.querySelector(".login_input-user");
const inputLoginPin = document.querySelector(".login_input-pin");
const inputTransferTo = document.querySelector(".form_input-to");
const inputTransferAmount = document.querySelector(".form_input-amount");
const inputLoanAmount = document.querySelector(".form_input-loan-amount");
const inputCloseUsername = document.querySelector(".form_input-user");
const inputClosePin = document.querySelector(".form_input-pin");

//Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

let currentAccount;

const accounts = [account1, account2, account3, account4];

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsernames(accounts);

//UI
const displayMovement = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i, array) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
       <div class="movement_row">
          <div class="movement_type movement_type-${type}">${
      i + 1
    } ${type}</div>
          <div class="movement_date">3 days ago</div>
          <div class="movement_value">${mov}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

const calculateBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income}€`;

  const outcome = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcome)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => deposit * (acc.interestRate / 100))
    .filter((int) => int > 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest}€`;
};

const updateUI = function (acc) {
  //Display movements
  displayMovement(acc.movements);

  //Display balance
  calculateBalance(acc);

  //Display Summary
  calcDisplaySummary(acc);
};

//Login
btnLogin.addEventListener("click", function (e) {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and message
    containerApp.classList.add("active");
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    //Update the UI
    updateUI(currentAccount);
  }
});

//Transfer
btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = "";

  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  }
});

//Request Loan
btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    //Add amount to current acc movement
    currentAccount.movements.push(amount);

    //Update the UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

//Delete Account
btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    //Delete account
    accounts.splice(index, 1);

    //Remove UI
    containerApp.classList.remove("active");
  }

  inputCloseUsername.value = inputClosePin.value = "";
});

let isSorted = false;

//Sort
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovement(currentAccount.movements, !isSorted);
  isSorted = !isSorted;
});
