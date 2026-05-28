require("dotenv").config();

const app = require("./src/app");

const connectToDB =
    require("./src/config/database").default ||
    require("./src/config/database");

const PORT = process.env.PORT || 5000;

async function startServer() {

    try {

        await connectToDB();
        app.set("trust proxy", 1);
        app.listen(PORT, () => {

            console.log(`Server is running on port ${PORT}`);

        });

    } catch (error) {

        console.error(
            "Failed to start server:",
            error.message
        );

        process.exit(1);
    }
}

app.get("/", (req, res) => {
  res.send("Backend running");
});
startServer();