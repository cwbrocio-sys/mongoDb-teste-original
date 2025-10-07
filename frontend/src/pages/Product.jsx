import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../contexts/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import ReviewSection from "../components/ReviewSection";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [activeTab, setActiveTab] = useState('description');
  const [isLoading, setIsLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0); // Novo estado para preço atual

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        // Definir preço inicial (primeiro tamanho ou preço base)
        if (item.sizes && item.sizes.length > 0) {
          if (typeof item.sizes[0] === 'object' && item.sizes[0].price) {
            setCurrentPrice(item.sizes[0].price);
            setSize(item.sizes[0].size);
          } else {
            setCurrentPrice(item.price);
            setSize(item.sizes[0]);
          }
        } else {
          setCurrentPrice(item.price);
        }
        return null;
      }
    });
  };

  // Função para atualizar preço quando tamanho muda
  const handleSizeChange = (selectedSize) => {
    setSize(selectedSize);
    
    if (productData.sizes && productData.sizes.length > 0) {
      // Verificar se sizes é array de objetos com preços
      if (typeof productData.sizes[0] === 'object' && productData.sizes[0].price) {
        const sizeData = productData.sizes.find(s => s.size === selectedSize);
        if (sizeData) {
          setCurrentPrice(sizeData.price);
        }
      } else {
        // Formato antigo - usar preço base
        setCurrentPrice(productData.price);
      }
    }
  };

  const handleAddToCart = async () => {
    if (!size) {
      const sizeSelector = document.querySelector('.size-selector');
      if (sizeSelector) {
        sizeSelector.classList.add('animate-shake');
        setTimeout(() => sizeSelector.classList.remove('animate-shake'), 500);
      }
      return;
    }

    setIsLoading(true);
    await addToCart(productData._id, size);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="min-h-screen bg-white">
      {/* Header Section - Minimalista */}
      <div className="border-b border-gray-400">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="prata-regular text-3xl lg:text-4xl text-[#414141] mb-2">
              {productData.name}
            </h1>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-4 h-4 text-[#414141] fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-[#414141] text-sm">(122 avaliações)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Product Section - Layout Limpo */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Images - Simples */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 border border-gray-400 overflow-hidden">
              <img 
                className="w-full h-full object-cover" 
                src={image} 
                alt={productData.name}
              />
            </div>
            
            <div className="flex gap-3 justify-center">
              {productData.image.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setImage(item)}
                  className={`w-16 h-16 border overflow-hidden transition-all ${
                    image === item 
                      ? 'border-[#414141] border-2' 
                      : 'border-gray-400'
                  }`}
                >
                  <img 
                    src={item} 
                    alt="" 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information - Minimalista */}
          <div className="space-y-8">
            {/* Price Section - Simples */}
            <div className="border border-gray-400 p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#414141] mb-2">
                  {currency}{currentPrice}
                </div>
                <div className="text-[#414141] text-sm">
                  ou 12x de {currency}{(currentPrice / 12).toFixed(2)} sem juros
                </div>
              </div>
            </div>

            {/* Product Description - Clean */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#414141]">Descrição</h3>
              <p className="text-[#414141] leading-relaxed text-sm">
                {productData.description}
              </p>
            </div>

            {/* Size Selection - Minimalista */}
            <div className="size-selector space-y-4">
              <h3 className="text-lg font-semibold text-[#414141]">Tamanho:</h3>
              <div className="flex gap-2 flex-wrap">
                {productData.sizes.map((item, index) => {
                  // Suportar tanto formato antigo (string) quanto novo (objeto)
                  const sizeValue = typeof item === 'object' ? item.size : item;
                  const sizePrice = typeof item === 'object' ? item.price : productData.price;
                  
                  return (
                    <button
                      onClick={() => handleSizeChange(sizeValue)}
                      key={index}
                      className={`px-4 py-2 border font-medium transition-all ${
                        sizeValue === size 
                          ? "border-[#414141] bg-[#414141] text-white" 
                          : "border-gray-400 text-[#414141] hover:border-[#414141]"
                      }`}
                    >
                      <div className="text-center">
                        <div className="font-medium">{sizeValue}</div>
                        {typeof item === 'object' && (
                          <div className="text-xs opacity-75">
                            {currency}{sizePrice}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons - Simples */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full bg-[#414141] text-white px-6 py-3 font-medium hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ADICIONANDO AO CARRINHO...
                  </>
                ) : (
                  'ADICIONAR AO CARRINHO'
                )}
              </button>
              
              <button
                onClick={() => {
                  if (isInWishlist(productId)) {
                    removeFromWishlist(productId);
                  } else {
                    addToWishlist(productId);
                  }
                }}
                className={`w-full flex items-center justify-center gap-3 px-6 py-3 font-medium border transition-colors ${
                  isInWishlist(productId)
                    ? 'bg-[#414141] text-white border-[#414141]'
                    : 'border-gray-400 text-[#414141] hover:border-[#414141]'
                }`}
              >
                <span className="text-lg">{isInWishlist(productId) ? '♥' : '♡'}</span>
                {isInWishlist(productId) ? 'REMOVER DOS FAVORITOS' : 'ADICIONAR AOS FAVORITOS'}
              </button>
            </div>

            {/* Trust Badges - Minimalista */}
            <div className="grid grid-cols-1 gap-3 pt-6 border-t border-gray-400">
              <div className="flex items-center gap-3 text-sm text-[#414141]">
                <span>✓</span>
                <span>Produto 100% Original</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#414141]">
                <span>✓</span>
                <span>Pagamento Seguro</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-[#414141]">
                <span>✓</span>
                <span>Troca Garantida até 7 dias</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Section - Minimalista */}
      <div className="border-t border-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Tab Navigation - Simples */}
          <div className="flex justify-center mb-8">
            <div className="flex border border-gray-400">
              {[
                { id: "characteristics", label: "Características" },
                { id: "why-choose", label: "Por que escolher?" },
                { id: "care", label: "Cuidados" },
                { id: "warranty", label: "Garantia" },
                { id: "reviews", label: "Avaliações" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 font-medium transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#414141] text-white"
                      : "text-[#414141] hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab !== "reviews" ? (
            <div className="max-w-4xl mx-auto">
              {/* Características */}
              {activeTab === "characteristics" && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold text-[#414141] text-center mb-8">
                    Características Principais
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border border-gray-400">
                      <h4 className="font-semibold text-[#414141] mb-2">Categoria</h4>
                      <p className="text-[#414141]">{productData.category}</p>
                    </div>
                    <div className="p-6 border border-gray-400">
                      <h4 className="font-semibold text-[#414141] mb-2">Subcategoria</h4>
                      <p className="text-[#414141]">{productData.subCategory}</p>
                    </div>
                    <div className="p-6 border border-gray-400">
                      <h4 className="font-semibold text-[#414141] mb-2">Tamanhos</h4>
                      <p className="text-[#414141]">{productData.sizes.join(', ')}</p>
                    </div>
                    <div className="p-6 border border-gray-400">
                      <h4 className="font-semibold text-[#414141] mb-2">Status</h4>
                      <p className="text-[#414141]">Em Estoque</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Por que escolher */}
              {activeTab === "why-choose" && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-[#414141] text-center mb-8">
                    Por que escolher este produto?
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="text-center p-6 border border-gray-400">
                      <div className="text-3xl mb-4">✨</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Qualidade Premium</h4>
                      <p className="text-[#414141] text-sm">Fragrância de alta qualidade com fixação duradoura e notas sofisticadas.</p>
                    </div>
                    <div className="text-center p-6 border border-gray-400">
                      <div className="text-3xl mb-4">🎯</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Versatilidade</h4>
                      <p className="text-[#414141] text-sm">Perfeito para diversas ocasiões, do dia a dia aos momentos especiais.</p>
                    </div>
                    <div className="text-center p-6 border border-gray-400">
                      <div className="text-3xl mb-4">💎</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Exclusividade</h4>
                      <p className="text-[#414141] text-sm">Uma fragrância única que destaca sua personalidade e estilo.</p>
                    </div>
                    <div className="text-center p-6 border border-gray-400">
                      <div className="text-3xl mb-4">⏰</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Longa Duração</h4>
                      <p className="text-[#414141] text-sm">Fixação prolongada que acompanha você durante todo o dia.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cuidados */}
              {activeTab === "care" && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-[#414141] text-center mb-8">
                    Cuidados e Conservação
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 border border-gray-400">
                      <div className="text-2xl mb-4">🌡️</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Temperatura</h4>
                      <p className="text-[#414141] text-sm">Mantenha em local fresco, longe do calor excessivo e luz solar direta.</p>
                    </div>
                    <div className="p-6 border border-gray-400">
                      <div className="text-2xl mb-4">💧</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Umidade</h4>
                      <p className="text-[#414141] text-sm">Evite locais muito úmidos como banheiros para preservar a qualidade.</p>
                    </div>
                    <div className="p-6 border border-gray-400">
                      <div className="text-2xl mb-4">📦</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Armazenamento</h4>
                      <p className="text-[#414141] text-sm">Guarde na embalagem original para proteger da luz e oxidação.</p>
                    </div>
                    <div className="p-6 border border-gray-400">
                      <div className="text-2xl mb-4">🔒</div>
                      <h4 className="font-semibold text-[#414141] mb-3">Conservação</h4>
                      <p className="text-[#414141] text-sm">Mantenha a tampa bem fechada após o uso para evitar evaporação.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Garantia */}
              {activeTab === "warranty" && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-semibold text-[#414141] text-center mb-8">
                    Garantia e Política de Troca
                  </h3>
                  <div className="border border-gray-400 p-8">
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-[#414141] mb-2">7 DIAS</div>
                      <p className="text-[#414141]">Garantia de troca</p>
                    </div>
                    <div className="space-y-4 text-[#414141] text-sm">
                      <p>• Oferecemos 7 dias para troca ou devolução a partir da data de recebimento.</p>
                      <p>• O produto deve estar em perfeitas condições, com embalagem original.</p>
                      <p>• Frete de devolução por conta do cliente, exceto em casos de defeito.</p>
                      <p>• Produtos lacrados serão aceitos para troca apenas se não violados.</p>
                      <p>• Entre em contato conosco para iniciar o processo de troca.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <ReviewSection productId={productId} />
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      <div className="border-t border-gray-400 py-12">
        <RelatedProducts
          category={productData.category}
          subCategory={productData.subCategory}
        />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
