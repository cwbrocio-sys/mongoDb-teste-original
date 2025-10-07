import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";

const Contact = () => {
  return (
    <div>
      {/* Título */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"FALE"} text2={"CONOSCO"} />
      </div>
      
      {/* Subtítulo */}
      <div className="text-center my-8 px-4">
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Estamos prontos para ajudar você a escolher sua próxima fragrância. ✨
        </p>
      </div>

      {/* Conteúdo */}
      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          className="w-full md:max-w-[480px]"
          src={assets.contact_img}
          alt="contact_img"
        />

        <div className="flex flex-col justify-center items-start gap-6 text-gray-600">
          <p className="text-lg">📱 WhatsApp: 
            <a 
              href="https://wa.me/5500000000000" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline ml-1"
            >
              Clique aqui
            </a>
          </p>

          <p className="text-lg">📧 E-mail: contato@parfumif.com</p>
          <p className="text-lg">📍 Atendimento Online em todo o Brasil</p>
          <p className="text-lg">🕒 Segunda a Sexta, 9h às 18h</p>

          <div>
            <p className="font-semibold">🔗 Siga-nos:</p>
            <div className="flex gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">Instagram</a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">TikTok</a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">Facebook</a>
            </div>
          </div>

          {/* Botão WhatsApp */}
          <a
            href="https://wa.me/5500000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-300"
          >
            Falar no WhatsApp Agora
          </a>
        </div>
      </div>
    </div>
  );
};

export default Contact;
