// const API = "http://www.omdbapi.com/?apikey=ac8a5131&s=blade";

// const returnAPI = (api) => {
//   fetch(api)
//     .then((response) => response.json())
//     .then((json) => console.log(json[0].title))
//     .catch((err) => console.log(err));
// };

// returnAPI(API);

// let arr = [5, 7, 4, 12];

// console.log(
//   arr.map((v, i) => {
//     return { number: v, id: i };
//   })
// );

// console.log(
//   arr.map((v, i) => {
//     return { number: v, id: i };
//   })
// );

// const reduce = (accumulator, currentValue) => accumulator + currentValue;

// console.log(arr.reduce(reduce));

// const cars = [
//   "Mclaren",
//   "Lamborghini",
//   "Ferrari",
//   "Porsche",
//   "Mercedes",
//   "Corvette",
// ];

// console.log(
//   arr.push(cars.filter((car) => car.substring(0).toLowerCase().includes("f")))
// );
// console.log(cars.sort());
// console.log(cars.reverse());

// var car = {
//   make: "Lamborghini",
//   model: "Huracán",
//   name: null,
//   fullName: function () {
//     this.name = this.make + " " + this.model;
//     console.log(this.name);
//   },
// };
// var anotherCar = {
//   make: "Ferrari",
//   model: "Italia",
//   name: null,
// };
// car.fullName.call(anotherCar);

// // console.log(anotherCar.name);

// var cars = [
//   { make: "Mclaren", model: "720s" },
//   { make: "Ferrari", model: "Italia" },
// ];
// var car = {
//   cars: [{ make: "Lamborghini", model: "Huracán" }],
//   fullName: function () {
//     console.log(this.cars[0].make + " " + this.cars[0].model);
//   },
// };
// var vehicle = car.fullName.bind(car);
// vehicle();

const calculateFee = (balance) => {
  if (balance < 200000) {
    return feeTierOne(balance);
  }
  if (balance < 500000) {
    return feeTierTwo(balance);
  }
  if (balance > 500000) {
    return feeTierThree(balance);
  }
};

const feeTierOne = (balance) => {
  return balance * 0.004 < 375 ? 375 : balance * 0.004;
};

const feeTierTwo = (balance) => {
  return (balance - 200000) * 0.0015 + 800;
};

const feeTierThree = (balance) => {
  return (balance - 500000) * 0.0003 + 1250;
};

console.log(calculateFee(50000));
