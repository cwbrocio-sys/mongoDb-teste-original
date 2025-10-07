import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Global variables
const currency = "brl";
const deliveryCharges = 10;

// Placing order using COD or MercadoPago
const placeOrder = async (req, res) => {
  try {
    console.log("=== PLACE ORDER CONTROLLER ===");
    console.log("Dados recebidos completos:", JSON.stringify(req.body, null, 2));
    
    const { userId, items, amount, address, paymentMethod, paymentData } = req.body;

    console.log("=== VALIDAÇÃO DOS DADOS ===");
    console.log("UserId:", userId);
    console.log("Items:", items ? `Array com ${items.length} itens` : "undefined");
    console.log("Amount:", amount, typeof amount);
    console.log("Address:", address ? "Presente" : "undefined");
    console.log("PaymentMethod:", paymentMethod);
    console.log("PaymentData:", paymentData ? "Presente" : "undefined");

    // Validar dados obrigatórios
    if (!userId) {
      console.log("❌ UserId não fornecido");
      return res.status(400).json({
        success: false,
        message: "UserId não fornecido - verifique se você está logado"
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log("❌ Items inválidos ou vazios");
      return res.status(400).json({
        success: false,
        message: "Carrinho vazio ou itens inválidos"
      });
    }

    if (!amount || amount <= 0) {
      console.log("❌ Amount inválido:", amount);
      return res.status(400).json({
        success: false,
        message: "Valor do pedido inválido"
      });
    }

    if (!address) {
      console.log("❌ Address não fornecido");
      return res.status(400).json({
        success: false,
        message: "Endereço de entrega não fornecido"
      });
    }

    // Se o método de pagamento for MercadoPago, a ordem será criada via webhook
    if (paymentMethod === "mercadopago") {
      console.log("⏳ Pagamento via MercadoPago. Aguardando confirmação do webhook.");
      // A ordem será criada no webhook após a confirmação do pagamento
      return res.json({
        success: true,
        message: "Pedido pendente, aguardando confirmação de pagamento.",
        // O ID da preferência é retornado pelo /create-preference, não aqui
      });
    }

    // Lógica para outros métodos de pagamento (ex: COD)
    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: paymentMethod || "COD",
      payment: false, // Pagamento não confirmado ainda
      date: Date.now(),
    };

    console.log("=== CRIANDO PEDIDO (NÃO-MERCADOPAGO) ===");
    console.log("OrderData final:", JSON.stringify(orderData, null, 2));

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    console.log("✅ Pedido salvo com sucesso, ID:", newOrder._id);

    // Limpar carrinho do usuário
    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    console.log("✅ Carrinho do usuário limpo");

    res.json({
      success: true,
      message: "Pedido realizado com sucesso",
      orderId: newOrder._id
    });
  } catch (error) {
    console.error("❌ ERRO AO CRIAR PEDIDO:", error);
    console.error("Stack trace:", error.stack);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao processar pedido",
      error: error.message
    });
  }
};

// All orders data for admin panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// User Order data for frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update order status from admin panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await orderModel.findByIdAndUpdate(orderId, { status });
    res.json({
      success: true,
      message: "Status Atualizado",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Get specific order for admin panel
const getOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    
    if (!order) {
      return res.json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Update complete order from admin panel
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const updateData = req.body;
    
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId, 
      updateData, 
      { new: true }
    );
    
    if (!updatedOrder) {
      return res.json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    res.json({
      success: true,
      message: "Pedido atualizado com sucesso",
      order: updatedOrder
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// Delete order from admin panel
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const deletedOrder = await orderModel.findByIdAndDelete(orderId);
    
    if (!deletedOrder) {
      return res.json({
        success: false,
        message: "Pedido não encontrado"
      });
    }

    res.json({
      success: true,
      message: "Pedido excluído com sucesso"
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  getOrder,
  updateOrder,
  deleteOrder
};
