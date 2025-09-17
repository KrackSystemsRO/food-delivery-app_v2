import buildApp from "./app";
import mongooseConnection from "./connections/mongoose.connection";

const start = async () => {
  try {
    mongooseConnection();

    const app = await buildApp();

    const port = parseInt(process.env.APP_PORT || "8081");

    await app.listen({ port, host: "0.0.0.0" });

    console.log(`🚀 Server running on http://localhost:${port}`);
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
};

start();
