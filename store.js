"use strict";

function statement(customer, movies, format) {
  if (format === 'text') {
    return statementText();
  }

  if (format === 'html') {
    return statementHtml();
  }

  function statementText() {
    let result = `Rental Record for ${customer.name}\n`;

      for (let rental of customer.rentals) {
          result += `\t${movieFor(rental, movies).title}\t${getAmount(rental)}\n`;
      }

      result += `Amount owed is ${getTotalAmount(customer)}\n`;
      result += `You earned ${getTotalFrequentRentalPoints(customer)} frequent renter points\n`;

      return result;
  }
  
  function statementHtml() {
      let result = `<h1>Rental Record for ${customer.name}</h1>\n`;
      result += '<table>\n';
      for (let rental of customer.rentals) {
          result += `<tr><td>${movieFor(rental, movies).title}</td><td>${getAmount(rental)}</td></tr>\n`;
      }
      result += '</table>\n';
      result += `<p>Amount owed is <em>${getTotalAmount(customer)}</em></p>\n`;
      result += `<p>You earned <em>${getTotalFrequentRentalPoints(customer)}</em> frequent renter points</p>`;

      return result;
  }

  function getAmount(rental){
    let thisAmount = 0;
      let movie = movieFor(rental, movies);
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
    return thisAmount;
  }

  function getFrequentRentalPoints (rental) {
      return (movieFor(rental, movies).code === "new" && rental.days > 2) ? 2 : 1;
  }

  function getTotalAmount (customer) {
    let totalAmount = 0;
    for (let rental of customer.rentals) {
      totalAmount += getAmount(rental);
    }
    return totalAmount;
  }

  function getTotalFrequentRentalPoints(customer) {
    let totalfrequentRenterPoints = 0;
    for (let rental of customer.rentals) {
      totalfrequentRenterPoints += getFrequentRentalPoints(rental);
    }
    return totalfrequentRenterPoints;
  }
}

function movieFor(rental, movies) {
    return movies[rental.movieID]
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
};

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
};

console.log(statement(customer, movies, 'text'));
console.log(statement(customer, movies, 'html'));