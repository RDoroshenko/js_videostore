"use strict";

class Customer {
    constructor (data, movies) {
        this._data = data;
        this._movies = movies;
    }

    get name() {return this._data.name; }
    get rentals() {return this._data.rentals.map (rental => new Rental(rental, this._movies)); }
    get TotalFrequentRentalPoints() {
        return this.rentals.map(rental => rental.FrequentRentalPoints ).reduce ((a, b) => a + b);
    }
    get TotalAmount() {
        return this.rentals.reduce((total, rental) => total + rental.Amount, 0);
    }
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
    get Amount() {
        let thisAmount = 0;
        let movie = this.movie;
        // determine amount for each movie
        switch (movie.code) {
            case "regular":
                thisAmount = 2;
                if (this.days > 2) {
                    thisAmount += (this.days - 2) * 1.5;
                }
                break;
            case "new":
                thisAmount = this.days * 3;
                break;
            case "childrens":
                thisAmount = 1.5;
                if (this.days > 3) {
                    thisAmount += (this.days - 3) * 1.5;
                }
                break;
        }
        return thisAmount;
    }
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
          result += `\t${rental.movie.title}\t${rental.Amount}\n`;
      }

      result += `Amount owed is ${customer.TotalAmount}\n`;
      result += `You earned ${customer.TotalFrequentRentalPoints} frequent renter points\n`;
      return result;
  }
  
  function statementHtml() {
      let result = `<h1>Rental Record for ${customer.name}</h1>\n`;
      result += '<table>\n';
      for (let rental of customer.rentals) {
          result += `<tr><td>${rental.movie.title}</td><td>${rental.Amount}</td></tr>\n`;
      }
      result += '</table>\n';
      result += `<p>Amount owed is <em>${customer.TotalAmount}</em></p>\n`;
      result += `<p>You earned <em>${customer.TotalFrequentRentalPoints}</em> frequent renter points</p>`;
      return result;
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
//console.log(statement(customer, movies, 'html'));