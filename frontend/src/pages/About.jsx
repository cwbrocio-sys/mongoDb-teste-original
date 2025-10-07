import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/frontend_assets/assets";
import NewsLetter from "../components/NewsLetter";

const About = () => {
  return (
    <div>
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"SOBRE"} text2={"NÓS"} />
      </div>
      <div className="my-10 flex flex-col md:flex-row gap-16">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt="about_img"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-gray-600">
          <p>
            A IF PARFUM nasceu do encontro entre duas paixões: a perfumaria e o sonho compartilhado por dois apaixonados por fragrâncias - Ingrid e Fernando (as iniciais por trás do nosso nome).

            Muito além de vender perfumes, criamos experiências olfativas personalizadas.

            Acreditamos que perfume é mais do que cheiro: é memória, presença e identidade.
          </p>
          
          <b className="text-gray-800">Nossa Missão</b>
          <p>
             é tornar a perfumaria importada e árabe mais acessível, prática e especial.

Por isso, oferecemos fracionados dos melhores perfumes, para que você encontre sua fragrância ideal antes de investir no frasco grande.

Cada detalhe aqui é pensado com carinho, da curadoria das fragrâncias ao atendimento personalizado.

Porque, no fim das contas, o perfume certo conta a sua história com um só borrifo.

Seja muito bem-vindo(a) à IF PARFUM.

Aqui, seu perfume não é só uma escolha...
é uma descoberta.

- Me chama se quiser ajuda pra escolher uma fragrância que combine com você!
          </p>
        </div>
      </div>
      <div className=" text-xl py-4">
        <Title text1={"PORQUÊ"} text2={"NOS ESCOLHER"} />
      </div>
      <div className="flex flex-col md:flex-row text-sm mb-20">
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Garantia de Qualidade:</b>
          <p className=" text-gray-600">
            Trabalhamos apenas com perfumes originais importados e árabes de altíssima qualidade.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Experiência Exclusiva:</b>
          <p className=" text-gray-600">
            Seleção especial de fragrâncias que unem sofisticação, intensidade e longa duração.
          </p>
        </div>
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Atendimento Premium:</b>
          <p className=" text-gray-600">
            Cuidamos de cada detalhe para que sua compra seja prática, segura e inesquecível.
          </p>
        </div>
      </div>
      <NewsLetter />
    </div>
  );
};

export default About;
