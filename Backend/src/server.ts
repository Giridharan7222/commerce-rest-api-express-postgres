import app from "./app";
import sequelize from "./database/connection";

const PORT = process.env.PORT || 5005;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Unable to connect to database:", error);
  });
