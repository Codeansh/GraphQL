import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

// db
import db from './_db.js';

// types
import { typeDefs } from './schema.js';

const resolvers = {

  Query: {
    games() {
      return db.games;
    },
    authors() {
      return db.authors;
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id === args.id);
    },
    author(_, args) {
      return db.authors.find((author) => author.id === args.id);
    },
    game(_, args) {
      return db.games.find((game) => game.id === args.id);
    }
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id)
    }
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((r) => r.author_id === parent.id)
    }
  },
  Review: {
    game(parent) {
      return db.games.find((g) => g.id === parent.game_id);
    },
    author(parent) {
      return db.authors.find((a) => a.id === parent.author_id)
    }
  },
  Mutation: {
  
    deleteGame(_, args) { 
      db.games = db.games.filter((g) => g.id !== args.id)
      return db.games
    },
    addGame(_, args) { 
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString()
      }
      db.games.push(game)
      return game
    },
    updateGame(_, args) {
      db.games = db.games.map((g) => { 
        if (g.id === args.id) {
          return { ...g, ...args.edits}
        }
        return g
      })
      return db.games.find((g) => g.id === args.id)
     }

  }
  

};

// The ApolloServer constructor requires two parameters: your schema

// definition and your set of resolvers.

const server = new ApolloServer({

  typeDefs,

  resolvers,

});


// Passing an ApolloServer instance to the `startStandaloneServer` function:

//  1. creates an Express app

//  2. installs your ApolloServer instance as middleware

//  3. prepares your app to handle incoming requests

const { url } = await startStandaloneServer(server, {

  listen: { port: 4000 },

});


console.log(`🚀  Server ready at: ${url}`);


