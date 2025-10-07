import React, { useState } from "react";
import { assets } from "../assets/frontend_assets/assets";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email) {
      alert("Obrigado por se inscrever! Você receberá seu desconto de 10% em breve.");
      setEmail("");
    }
  };

  return (
    <div className="bg-gray-50 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          
          {/* Newsletter Section */}
          <div className="space-y-6 md:col-span-1">
            <img src={assets.logo} className="w-28 sm:w-32" alt="logo" />
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 leading-tight">
                Assine nossa newsletter e ganhe 10% OFF na primeira compra!
              </h3>
              <p className="text-sm text-gray-600">
                Fique por dentro das nossas novidades e promoções exclusivas.
              </p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
                  required
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-sm"
                >
                  INSCREVER
                </button>
              </form>
            </div>
          </div>

          {/* Company Section - Políticas */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">IF PARFUM</h3>
            <div className="space-y-4">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                <span className="font-medium">Troca garantida:</span> em casos de defeito ou erro no envio.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                <span className="font-medium">Devolução em até 7 dias:</span> perfumes 100% originais e lacrados serão aceitos.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                <span className="font-medium">Atendimento exclusivo:</span> suporte personalizado para cada cliente.
              </p>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                Perfumes Importados & Árabes de alta qualidade.
              </p>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">ENTRE EM CONTATO</h3>
            <div className="space-y-4">
              <a 
                href="https://wa.me/5541997112252" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-green-600 transition-colors group"
              >
                <div className="font-medium text-sm sm:text-base">WhatsApp</div>
                <div className="text-xs sm:text-sm text-gray-500 group-hover:text-green-500">41 99711-2252</div>
              </a>
              
              <div className="text-gray-600">
                <div className="font-medium text-sm sm:text-base">Email</div>
                <div className="text-xs sm:text-sm text-gray-500">contato@ifparfum.com</div>
              </div>
              
              <a 
                href="https://www.instagram.com/if_parfum_?igsh=MTI1d3docDlneHU2eg%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-gray-600 hover:text-pink-600 transition-colors group"
              >
                <div className="font-medium text-sm sm:text-base">Instagram</div>
                <div className="text-xs sm:text-sm text-gray-500 group-hover:text-pink-500">@if_parfum_</div>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-6 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-center text-gray-500">
            Copyright 2024 © IF Parfum - Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
