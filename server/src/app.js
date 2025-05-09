"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dbConnect_1 = __importDefault(require("./utils/dbConnect"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const gigRoute_1 = __importDefault(require("./routes/gigRoute"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
const distPath = path_1.default.join(__dirname, "dist");
app.use(express_1.default.static(distPath));
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)("Dlancer-FYP"));
(0, dbConnect_1.default)();
app.use('/api/users', userRoute_1.default);
app.use('/api/gig', gigRoute_1.default);
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});
