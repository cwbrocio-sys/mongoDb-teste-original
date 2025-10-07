import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// function for adding product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      bestseller,
      sizes,
      sizePrices // Novo campo para preços por tamanho
    } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Processar tamanhos com preços
    let processedSizes = [];
    if (sizePrices) {
      // Se sizePrices foi enviado, usar o novo formato
      processedSizes = JSON.parse(sizePrices);
    } else {
      // Compatibilidade com formato antigo
      const parsedSizes = JSON.parse(sizes.replace(/'/g, '"'));
      processedSizes = parsedSizes.map(size => ({
        size: size,
        price: Number(price) // Usar preço base para todos os tamanhos
      }));
    }

    const productData = {
      name,
      description,
      category,
      price: Number(price), // Manter preço base para compatibilidade
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: processedSizes,
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Produto Adicionado" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
    console.log(error);
  }
};

// Dados de fallback para quando não há conexão com banco
const fallbackProducts = [
  {
    _id: "fallback1",
    name: "Oud Royal",
    description: "Um perfume luxuoso com notas de oud, âmbar e especiarias orientais. Perfeito para ocasiões especiais e noites elegantes.",
    price: 299,
    image: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&h=400&fit=crop&crop=center"],
    category: "Masculino",
    subCategory: "Oriental",
    sizes: ["50ml", "100ml"],
    bestseller: true,
    date: Date.now()
  },
  {
    _id: "fallback2",
    name: "Rose Garden",
    description: "Delicada fragrância floral com pétalas de rosa búlgara, jasmim e um toque de baunilha. Ideal para o dia a dia.",
    price: 189,
    image: ["https://images.unsplash.com/photo-1588405748880-12d1d2a59d75?w=400&h=400&fit=crop&crop=center"],
    category: "Feminino",
    subCategory: "Floral",
    sizes: ["30ml", "50ml", "100ml"],
    bestseller: false,
    date: Date.now()
  },
  {
    _id: "fallback3",
    name: "Citrus Fresh",
    description: "Explosão cítrica com bergamota, limão siciliano e laranja doce. Refrescante e energizante para qualquer momento.",
    price: 149,
    image: ["https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=400&fit=crop&crop=center"],
    category: "Unissex",
    subCategory: "Cítrico",
    sizes: ["50ml", "100ml"],
    bestseller: true,
    date: Date.now()
  },
  {
    _id: "fallback4",
    name: "Musk Sensual",
    description: "Fragrância envolvente com almíscar branco, sândalo e notas amadeiradas. Sedutora e marcante.",
    price: 259,
    image: ["https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&h=400&fit=crop&crop=center"],
    category: "Feminino",
    subCategory: "Oriental",
    sizes: ["50ml", "100ml"],
    bestseller: false,
    date: Date.now()
  },
  {
    _id: "fallback5",
    name: "Lavender Dreams",
    description: "Relaxante blend de lavanda francesa, camomila e cedro. Perfeito para momentos de tranquilidade.",
    price: 169,
    image: ["https://images.unsplash.com/photo-1571875257727-256c39da42af?w=400&h=400&fit=crop&crop=center"],
    category: "Unissex",
    subCategory: "Aromático",
    sizes: ["30ml", "50ml"],
    bestseller: false,
    date: Date.now()
  },
  {
    _id: "fallback6",
    name: "Amber Nights",
    description: "Sofisticada composição com âmbar, patchouli e especiarias. Ideal para noites especiais e encontros românticos.",
    price: 329,
    image: ["https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop&crop=center"],
    category: "Masculino",
    subCategory: "Oriental",
    sizes: ["50ml", "100ml"],
    bestseller: true,
    date: Date.now()
  }
];

// function for listing product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log("Erro ao buscar produtos do banco, usando dados de fallback:", error.message);
    // Retornar dados de fallback quando não conseguir conectar ao banco
    res.json({ success: true, products: fallbackProducts });
  }
};

// function for removing product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({
      success: true,
      message: "Produto Removido",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// function for getting single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { listProducts, addProduct, removeProduct, singleProduct };
