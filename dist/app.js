"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const apollo_server_express_1 = require("apollo-server-express");
const typeDefs_1 = require("./graphql/typeDefs");
const resolvers_1 = require("./resolvers");
const is_auth_1 = require("./middleware/is-auth");
const nodemailer_1 = __importDefault(require("nodemailer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("./models/user");
const transporter = nodemailer_1.default.createTransport({
    service: 'Gmail',
    auth: {
        user: 'aymen2jelal@gmail.com',
        pass: 'Davidwestside1'
    }
});
const app = express_1.default();
app.use(is_auth_1.isAuth);
//app.use('/api', apiRouter);
app.get('/confirmation/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let decodedToken;
    try {
        decodedToken = jsonwebtoken_1.default.verify(req.params.token, 'topsecret');
        let user = Object.assign({}, decodedToken.user);
        user.confirmed = true;
        yield user_1.updateUser(user);
    }
    catch (error) {
        res.send('error');
    }
    return res.redirect('https://fathomless-refuge-61282.herokuapp.com/login');
}));
const server = new apollo_server_express_1.ApolloServer({
    typeDefs: typeDefs_1.typeDefs,
    resolvers: resolvers_1.resolvers,
    context: ({ req, res }) => __awaiter(void 0, void 0, void 0, function* () { return ({ req, res }); }),
    introspection: true,
    playground: true
});
const EMAIL_SECRET = 'asdf1093KMnzxcvnkljvasdu09123nlasdasdf';
server.applyMiddleware({ app });
app.listen(process.env.PORT || 4000, () => console.log(`server ready `));
//console.log(process.env.DATABASE);
//app.listen(5000, () => console.log('server running'));
