"use strict";

class Customer {
    constructor (data) {
        this._data = data;
    }

    get name() {return this._data.name; }
    get rentals() {return this._data.rentals; }
}

class Rental {
    constructor(data){
        this._data=data;
    }
    get days() {return this._data.days; }
    get movieID() {return this._data.movieID; }
}

function statement(customerArg, movies, format) {
  const customer = new Customer(customerArg);
    if (format === 'text') {
    return statementText();
  }

  if (format === 'html') {
    return statementHtml();
  }

  function statementText() {
    let result = `Rental Record for ${customer.name}\n`;

      for (let rental of customer.rentals) {
          result += `\t${movieFor(rental, movies).title}\t${getAmount(rental, movies)}\n`;
      }

      result += `Amount owed is ${getTotalAmount(customer, movies)}\n`;
      result += `You earned ${getTotalFrequentRentalPoints(customer, movies)} frequent renter points\n`;
      return result;
  }
  
  function statementHtml() {
      let result = `<h1>Rental Record for ${customer.name}</h1>\n`;
      result += '<table>\n';
      for (let rental of customer.rentals) {
          result += `<tr><td>${movieFor(rental, movies).title}</td><td>${getAmount(rental, movies)}</td></tr>\n`;
      }
      result += '</table>\n';
      result += `<p>Amount owed is <em>${getTotalAmount(customer, movies)}</em></p>\n`;
      result += `<p>You earned <em>${getTotalFrequentRentalPoints(customer, movies)}</em> frequent renter points</p>`;
      return result;
  }

}

function movieFor(rental, movies) {
    return movies[rental.movieID]
}

function getAmount(rental, movies){
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

function getFrequentRentalPoints (rental, movies) {
    return (movieFor(rental, movies).code === "new" && rental.days > 2) ? 2 : 1;
}

function getTotalAmount (customer, movies) {
    let totalAmount = 0;
    for (let rental of customer.rentals) {
        totalAmount += getAmount(rental, movies);
    }
    return totalAmount;
}

function getTotalFrequentRentalPoints(customer, movies) {
    let totalfrequentRenterPoints = 0;
    for (let rental of customer.rentals) {
        totalfrequentRenterPoints += getFrequentRentalPoints(rental, movies);
    }
    return totalfrequentRenterPoints;
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