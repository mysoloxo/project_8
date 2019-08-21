'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate:{
        notEmpty: true
      }
    },
    author: {
      type: DataTypes.STRING,
      validate:{
        notEmpty: true
      }
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER,
    
  }, {
    instanceMethods: {
      publishedAt: function() {
        return dateFormat(this.createdAt, "dddd, mmmm dS, yyyy, h:MM TT");
      },
      shortDescription: function(){ 
        return this.body.length > 30 ? this.body.substr(0, 30) + "..." : this.body;
      }
    }
  });
  Book.associate = function(models) {
    // associations can be defined here
  };
  return Book;
};