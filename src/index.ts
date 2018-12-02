import { GraphQLServer } from "graphql-yoga";
import { createConnection, getRepository } from "typeorm";
import { User } from "./entities/User";

const typeDefs = `
  type User {
    id: ID!
    name: String!
    email: String!
  }
  type Query {
    hello(name: String): String!
    user(id: ID!): User!
  }
  type Mutation {
    addUser(name: String!, email: String!): User
  }
`;

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    user: (_, { id }) => {
      return getRepository(User).findOne(id);
    }
  },
  Mutation: {
    addUser: (_, { name, email }) => {
      const user = new User();
      user.email = email;
      user.name = name;
      return getRepository(User).save(user);
    }
  }
};

const server = new GraphQLServer({ typeDefs, resolvers });

createConnection()
  .then(() => {
    server.start(() => console.log("Server is running on localhost:4000"));
  })
  .catch(() => {
    console.log("Couldn't connect to the database.");
  });
