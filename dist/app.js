"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./resolvers");
const app = express_1.default();
//app.use('/api', apiRouter);
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers_1.resolvers
});
server.applyMiddleware({ app });
let port = process.env.port || 4000;
app.listen(port, () => console.log(`server ready at port ${port}`));
//console.log(process.env.DATABASE);
//app.listen(5000, () => console.log('server running'));
