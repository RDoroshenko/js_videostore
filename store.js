"use strict";

class Customer {
    constructor (data, movies) {
        this._data = data;
        this._movies = movies;
    }

    get name() {return this._data.name; }
    get rentals() {return this._data.rentals.map (rental => new Rental(rental, this._movies)); }
}

class Rental {
    constructor(data, movies){
        this._data=data;
        this._movies = movies;
    }
    get days() {return this._data.days; }
    get movieID() {return this._data.movieID; }
    get movie() {return this._movies[this.movieID]}
    get FrequentRentalPoints() {return (this.movie.code === "new" && this.days > 2) ? 2 : 1;}
}

function statement(customerArg, movies, format) {
  const customer = new Customer(customerArg, movies);
    if (format === 'text') {
    return statementText();
  }

  if (format === 'html') {
    return statementHtml();
  }

  function statementText() {
    let result = `Rental Record for ${customer.name}\n`;

      for (let rental of customer.rentals) {
          result += `\t${rental.movie.title}\t${getAmount(rental, movies)}\n`;
      }

      result += `Amount owed is ${getTotalAmount(customer, movies)}\n`;
      result += `You earned ${getTotalFrequentRentalPoints(customer, movies)} frequent renter points\n`;
      return result;
  }
  
  function statementHtml() {
      let result = `<h1>Rental Record for ${customer.name}</h1>\n`;
      result += '<table>\n';
      for (let rental of customer.rentals) {
          result += `<tr><td>${rental.movie.title}</td><td>${getAmount(rental, movies)}</td></tr>\n`;
      }
      result += '</table>\n';
      result += `<p>Amount owed is <em>${getTotalAmount(customer, movies)}</em></p>\n`;
      result += `<p>You earned <em>${getTotalFrequentRentalPoints(customer, movies)}</em> frequent renter points</p>`;
      return result;
  }

}

function getAmount(rental){
    let thisAmount = 0;
    let movie = rental.movie;
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
    return (rental.movie.code === "new" && rental.days > 2) ? 2 : 1;
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