import mongoose, { mongo } from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }, // Preço base (para compatibilidade)
    image: { type: Array, required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { 
        type: Array, 
        required: true,
        default: []
        // Novo formato: [{ size: "5ML", price: 25 }, { size: "10ML", price: 45 }]
    },
    bestseller: { type: Boolean },
    date: { type: Number, required: true }
});

const productModel =
  mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;
