'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data


// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2022-08-31T23:36:17.929Z',
    '2022-09-11T10:51:36.790Z',
  ],
  currency: 'INR',
  locale: 'hi-HI', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

let currentAccount;
const taarik = new Date();
// /////////////////////

const calcDisplayDate = function (date){
  
  const dates = (date1,date2)=>Math.round(Math.abs((date2-date1)/(1000 *60* 60*24)));

  const daysPassed = dates(new Date(),date);
  if(daysPassed===0)return 'Today'
  if(daysPassed===1)return 'Yestarday'
  if(daysPassed<=7)return `${daysPassed} days ago`
  return new Intl.DateTimeFormat(currentAccount.locale).format(date)
  
}
// /////////////////////

const movementsDisplay = function (acc) {
  containerMovements.innerHTML = '';

  const numberormat = new Intl.NumberFormat(acc.locale).format(acc);
  console.log(numberormat)

  acc.movements?.forEach(function (value, i) {
    const typeTransc = value < 0 ? 'withdrawal' : 'deposit';
    
    
    const nayi_taarik = new Date(acc.movementsDates[i]);

    const displayDat = calcDisplayDate(nayi_taarik);

    const displayMoney = `<div class="movements">
  <div class="movements__row">
    <div class="movements__type movements__type--${typeTransc}">${
      i + 1
    }${typeTransc} </div>
    <div class="movements__date">${displayDat}</div>
    <div class="movements__value">${value.toFixed(2)}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', displayMoney);
  });
};

//////////////////////////////

const username = function (acunt) {
  acunt.forEach(function (val) {
    val.userName = val.owner
      .toLowerCase()
      .split(' ')
      .map(val => val[0])
      .join('');
  });
};
username(accounts);

///////////////////

const displayDeposit = function (account) {
  const calcIncome = account.movements
    .filter(val => val > 0)
    .reduce((accu, val) => accu + val, 0);
  labelSumIn.textContent = `${calcIncome.toFixed(2)}€`;

  const calcOut = account.movements
    .filter(val => val < 0)
    .reduce((accu, val) => accu + val, 0);
  labelSumOut.textContent = `${Math.abs(calcOut.toFixed(2))}€`;
  // math.abs() removes - sign from calcout

  const intr = account.movements
    .filter(val => val > 0)
    .map(val => (val * account.interestRate) / 100)
    .reduce((accu, val) => accu + val);
  labelSumInterest.textContent = `${intr.toFixed(2)}€`;
};
/////////////////////////////////////////////////

/////////////////////////////////////////////////


btnLogin.addEventListener('click', function (e) {
  // preventing page from relod automatically
  e.preventDefault();

  currentAccount = accounts.find(
    account => account.userName === inputLoginUsername.value
  );
  // display name
  currentAccount?.pin === Number(inputLoginPin.value)
    ? (labelWelcome.textContent = `welcome, ${currentAccount.owner}`)
    : null;
  // diplay UI
  containerApp.style.opacity = 100;
  // remove data from username and pin section
  inputLoginUsername.value = inputLoginPin.value = '';
  // to remove blinkin cursor from their
  inputLoginPin.blur();
  displayCb();
// using date as api
    const option={
      hour:'numeric'
      ,minute:'2-digit'
      ,day:'2-digit'
      ,month:'short'
      ,year:'numeric'
    }
    labelDate.textContent = new Intl.DateTimeFormat('en-GB',option).format(taarik)
});
/////////////////////////////////////////////////
let timer;
const displayCb = function () {
  // display movementsDisplay

  movementsDisplay(currentAccount);
console.log(timer)

  clearTimeout(timer)  
  timer = displayTimer()
  
  // display current balance
  labelBalance.textContent = currentAccount.movements.reduce((accum, val) => {
    return accum + val;
  });
  // pushing current balance to object
  currentAccount.mainBalance = `${labelBalance.textContent}`;

  // display summary = total deposit  / total withdrawal / intrest
  displayDeposit(currentAccount);
};
/////////////////////////////////////////////////
// transfer money from one person to another person bank account
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const amt = Number(inputTransferAmount.value);
  const reciverAcc = accounts.find(
    val => val.userName === inputTransferTo.value
  );

  if (
    0 < amt &&
    currentAccount.mainBalance >= amt &&
    currentAccount.userName !== reciverAcc.userName &&
    reciverAcc
  ) {
    currentAccount.movements.push(-amt);
    reciverAcc.movements.push(amt);
  }
  currentAccount.movementsDates.push(new Date().toISOString())
  reciverAcc.movementsDates.push(new Date().toISOString())
  displayCb();
});

///////////////////////////////////////////
// request loan if your depost is grater than 10% of loan amount in your bank
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amunt = Number(inputLoanAmount.value);
  if (amunt > 0 && currentAccount.movements.some(val => val >= amunt * 0.1)) {
    currentAccount.movements.push(amunt);
    currentAccount.movementsDates.push(new Date())
  }

  setTimeout(() => displayCb(currentAccount), 5000); 
  inputLoanAmount.value = '';
});
///////////////////////////////////////////
// delete current user account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    accounts.splice(currentAccount, 1);
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '';
});
///////////////////////////////////////////
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount.movements.sort((a, b) => a - b, 0);

  displayCb();
});

///////////////////////////////////////////
const totalBalance = accounts
  .flatMap(val => val.movements)
  .reduce((accu, val) => accu + val, 0);

// .reduce((accu, val) => accu + val, 0);
console.log(totalBalance);

// //////////////////////////////////////////////////////////////

const displayTimer = function(){
  let sec=60;
  let min=2;
const tick =function(){
  --sec
if(sec===0){sec=60,min--}
if(min>=0){
  labelTimer.textContent=`${ String(min).padStart(2,0)}:${String(sec).padStart(2,0)}`;
}if(min===0&&sec===0){
  containerApp.style.opacity=0;
  clearInterval(timer)
  sec=60,min=2}
}
tick()
timer =setInterval( tick,1000);
return timer
}