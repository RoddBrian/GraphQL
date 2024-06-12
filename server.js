const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');

const app = express();
app.use(cors());

let items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' }
];

const typeDefs = gql`
    type Item {
        id: ID!
        name: String!
    }

    type Query {
        items: [Item]
        item(id: ID!): Item
    }

    type Mutation {
        addItem(name: String!): Item
    }
`;

const resolvers = {
    Query: {
        items: () => items,
        item: (parent, args) => items.find(item => item.id === args.id)
    },
    Mutation: {
        addItem: (parent, args) => {
            const newItem = { id: String(items.length + 1), name: args.name };
            items.push(newItem);
            return newItem;
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
    server.applyMiddleware({ app });

    app.listen({ port: 4000 }, () =>
        console.log(`Servidor GraphQL corriendo en http://localhost:4000${server.graphqlPath}`)
    );
});
