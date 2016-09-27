"use strict"

function statement(customer, movies) {
  let totalfrequentRenterPoints = 0;
  let result = `Rental Record for ${customer.name}\n`;

  for (let rental of customer.rentals) {
    totalfrequentRenterPoints += getFrequentRentalPoints(rental);
  }

  for (let rental of customer.rentals) {
    result += `\t${movieFor(rental).title}\t${getAmount(rental)}\n`;
  }

  let totalAmount = 0;
  for (let rental of customer.rentals) {
    totalAmount += getAmount(rental);
  }

  // add footer lines
  result += `Amount owed is ${totalAmount}\n`;
  result += `You earned ${totalfrequentRenterPoints} frequent renter points\n`;

  return result;

  function movieFor(rental) {
    return movies[rental.movieID]
  }

  function getAmount(rental){
    let thisAmount = 0;
    let movie = movieFor(rental);

    // determine amount for each movie
    switch (movie.code) {
      case "regular":
        thisAmount = 2;
        if (rental.days > 2) {
          thisAmount += (rental.days - 2) * 1.5;
        }
        break;
      case "new":
        thisAmount = rental.days * 3;
        break;
      case "childrens":
        thisAmount = 1.5;
        if (rental.days > 3) {
          thisAmount += (rental.days - 3) * 1.5;
        }
        break;
    }
    return thisAmount
  }

  function getFrequentRentalPoints (rental) {
    return (movieFor(rental).code === "new" && rental.days > 2) ? 2 : 1;
  }
}

let customer = {
  name: "martin",
  rentals: [{
    "movieID": "F001",
    "days": 3
  }, {
    "movieID": "F002",
    "days": 1
  }, ]
}

let movies = {
  "F001": {
    "title": "Ran",
    "code": "regular"
  },
  "F002": {
    "title": "Trois Couleurs: Bleu",
    "code": "regular"
  },
  // etc
}

console.log(statement(customer, movies))