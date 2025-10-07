import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected Successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Database Connection Error:", err.message);
    });

    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ecommerce");
    console.log("Tentativa de conexão com MongoDB realizada");
  } catch (error) {
    console.log("Erro ao conectar com MongoDB:", error.message);
    console.log("Servidor continuará funcionando sem banco de dados");
  }
};

export default connectDB;
