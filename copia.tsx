import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend_assets/assets";
import { ShopContext } from "../contexts/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

const PlaceOrder = () => {
    const [method, setMethod] = useState("mercadopago");
    const [preferenceId, setPreferenceId] = useState(null);
    const { token } = useContext(ShopContext);
    const { navigate, backendUrl, cartItems, setCartItems, getCartAmount, deliveryFee, products } = useContext(ShopContext);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
    });

    // Initialize MercadoPago
    useEffect(() => {
        if (!window.MercadoPago) {
            const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
            if (publicKey && publicKey !== 'TEST-your-public-key-here') {
                initMercadoPago(publicKey, { locale: 'pt-BR' });
            } else {
                console.error('MercadoPago public key not configured properly');
            }
        }
    }, []);

    // Create preference when method is mercadopago
    useEffect(() => {
        const createPreference = async () => {
            try {
                if (method !== "mercadopago") {
                    setPreferenceId("");
                    return;
                }

                let orderItems = [];
                for (const items in cartItems) {
                    for (const item in cartItems[items]) {
                        if (cartItems[items][item]) {
                            const itemInfo = structuredClone(products.find(product => product._id === items));
                            if (itemInfo) {
                                itemInfo.size = item;
                                itemInfo.quantity = cartItems[items][item];
                                orderItems.push(itemInfo);
                            }
                        }
                    }
                }

                if (orderItems.length > 0) {
                    console.log("Criando preferência do Mercado Pago...");

                    const items = orderItems.map(item => ({
                        title: item.name,
                        quantity: item.quantity,
                        price: item.price,
                    }));

                    const payer = { email: formData.email || "test@example.com" };

                    const response = await axios.post(`${backendUrl}/api/mercadopago/create-preference`, { items, payer });

                    console.log("Preference Response:", response.data);

                    if (response.data.preferenceId) {
                        setPreferenceId(response.data.preferenceId);
                        console.log("PreferenceId definido:", response.data.preferenceId);
                    }
                }
            } catch (error) {
                console.error("Erro ao criar preferência:", error);
                toast.error("Erro ao criar preferência de pagamento");
            }
        };

        if (method === "mercadopago" && Object.keys(cartItems).length > 0) {
            createPreference();
        }
    }, [method, cartItems, backendUrl, token, products, formData.email]);

    const onChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        if (method === "mercadopago" && !preferenceId) {
            toast.error("Aguarde as opções de pagamento carregarem");
            return;
        }

        try {
            let orderItems = [];
            for (const items in cartItems) {
                for (const item in cartItems[items]) {
                    if (cartItems[items][item]) {
                        const itemInfo = structuredClone(products.find(product => product._id === items));
                        if (itemInfo) {
                            itemInfo.size = item;
                            itemInfo.quantity = cartItems[items][item];
                            orderItems.push(itemInfo);
                        }
                    }
                }
            }

            const orderData = {
                address: formData,
                items: orderItems,
                amount: getCartAmount() + deliveryFee,
            };

            switch (method) {
                case "cod":
                    const response = await axios.post(`${backendUrl}/api/order/place`, orderData, { headers: { token } });
                    if (response.data.success) {
                        setCartItems({});
                        navigate("/orders");
                    } else {
                        toast.error(response.data.message);
                    }
                    break;

                case "stripe":
                    const responseStripe = await axios.post(`${backendUrl}/api/order/stripe`, orderData, { headers: { token } });
                    if (responseStripe.data.success) {
                        const { session_url } = responseStripe.data;
                        window.location.replace(session_url);
                    } else {
                        toast.error(responseStripe.data.message);
                    }
                    break;

                default:
                    break;
            }
        } catch (error) {
            console.error(error);
            toast.error(error.message);
        }
    };

    return (
        <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t">
            {/* Left Side */}
            <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
                <div className="text-xl sm:text-2xl my-3">
                    <Title text1="DELIVERY" text2="INFORMATION" />
                </div>
                <div className="flex gap-3">
                    <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="First Name" onChange={onChangeHandler} name="firstName" value={formData.firstName} />
                    <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Last Name" onChange={onChangeHandler} name="lastName" value={formData.lastName} />
                </div>
                <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="email" placeholder="Email Address" onChange={onChangeHandler} name="email" value={formData.email} />
                <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Street" onChange={onChangeHandler} name="street" value={formData.street} />
                <div className="flex gap-3">
                    <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="City" onChange={onChangeHandler} name="city" value={formData.city} />
                    <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="State" onChange={onChangeHandler} name="state" value={formData.state} />
                </div>
                <div className="flex gap-3">
                    <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Zipcode" onChange={onChangeHandler} name="zipcode" value={formData.zipcode} />
                    <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Country" onChange={onChangeHandler} name="country" value={formData.country} />
                </div>
                <input required className="border border-gray-300 rounded py-1.5 px-3.5 w-full" type="text" placeholder="Phone" onChange={onChangeHandler} name="phone" value={formData.phone} />
            </div>

            {/* Right Side */}
            <div className="mt-8">
                <div className="mt-8 min-w-80">
                    <CartTotal />
                </div>
                <div className="mt-12">
                    <Title text1="PAYMENT" text2="METHOD" />
                    {/* Payment method selection */}
                    <div className="flex gap-3 flex-col lg:flex-row">
                        <div onClick={() => setMethod("mercadopago")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
                            <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "mercadopago" ? "bg-green-400" : ""}`}></p>
                            <p className="text-gray-500 text-sm font-medium mx-4">MERCADO PAGO</p>
                        </div>
                    </div>

                    {/* MercadoPago Payment Component */}
                    {method === "mercadopago" && preferenceId && (
                        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
                            <Payment
                                initialization={{
                                    preferenceId,
                                    mercadoPago: window.MercadoPago,
                                }}
                                customization={{
                                    paymentMethods: { creditCard: "all", debitCard: "all", ticket: "all", bankTransfer: "all" },
                                    visual: { style: { theme: "default" } },
                                }}
                                onSubmit={({ selectedPaymentMethod, formData: paymentFormData }) => {
                                    console.log("Método escolhido:", selectedPaymentMethod);
                                    console.log("Dados do formulário:", paymentFormData);
                                    toast.success("Pagamento processado com sucesso!");
                                }}
                                onError={(error) => {
                                    console.error("Payment error:", error);
                                    toast.error("Erro no pagamento");
                                }}
                                onReady={() => console.log("Payment component ready")}
                            />
                        </div>
                    )}

                    {/* Loading state */}
                    {method === "mercadopago" && !preferenceId && (
                        <div className="mt-6 p-4 border rounded-lg bg-gray-50 text-center">
                            <p>Carregando opções de pagamento...</p>
                        </div>
                    )}

                    {method !== "mercadopago" && (
                        <div className="w-full text-end mt-8">
                            <button type="submit" className="bg-black text-white px-16 py-3 text-sm">
                                PLACE ORDER
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default PlaceOrder;
