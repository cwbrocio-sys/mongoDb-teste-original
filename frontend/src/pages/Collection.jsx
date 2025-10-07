import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [minRating, setMinRating] = useState(0);
  const [availability, setAvailability] = useState("all");
  const [intensity, setIntensity] = useState([]);
  const [skinType, setSkinType] = useState([]);
  const [promotion, setPromotion] = useState(false);
  const [gridColumns, setGridColumns] = useState(4);
  const [productsPerPage, setProductsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleIntensity = (e) => {
    if (intensity.includes(e.target.value)) {
      setIntensity((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setIntensity((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSkinType = (e) => {
    if (skinType.includes(e.target.value)) {
      setSkinType((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSkinType((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    // Filtro de intensidade (baseado na categoria ou subcategoria)
    if (intensity.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        intensity.some(int => 
          item.subCategory?.toLowerCase().includes(int.toLowerCase()) ||
          item.description?.toLowerCase().includes(int.toLowerCase())
        )
      );
    }

    // Filtro de tipo de pele (baseado na categoria)
    if (skinType.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        skinType.includes(item.category)
      );
    }

    // Filtro de promoção (produtos com desconto)
    if (promotion) {
      productsCopy = productsCopy.filter((item) =>
        item.originalPrice && item.originalPrice > item.price
      );
    }

    // Price range filter
    productsCopy = productsCopy.filter((item) =>
      item.price >= priceRange.min && item.price <= priceRange.max
    );

    // Rating filter (assuming products have a rating field)
    if (minRating > 0) {
      productsCopy = productsCopy.filter((item) =>
        (item.rating || 0) >= minRating
      );
    }

    // Availability filter
    if (availability === "in-stock") {
      productsCopy = productsCopy.filter((item) =>
        item.stock && item.stock > 0
      );
    } else if (availability === "out-of-stock") {
      productsCopy = productsCopy.filter((item) =>
        !item.stock || item.stock === 0
      );
    }

    setFilterProducts(productsCopy);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filterProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filterProducts.slice(startIndex, startIndex + productsPerPage);

  const sortProduct = () => {
    let filterProductsCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(filterProductsCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(filterProductsCopy.sort((a, b) => b.price - a.price));
        break;
      case "rating":
        setFilterProducts(filterProductsCopy.sort((a, b) => (b.rating || 0) - (a.rating || 0)));
        break;
      case "newest":
        setFilterProducts(filterProductsCopy.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0)));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products, priceRange, minRating, availability]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">

      {/* Filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTROS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt="dropdown_icon"
          />
        </p>
        
        {/* Status Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">Filtrar por status</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={availability === "in-stock"}
                onChange={(e) => setAvailability(e.target.checked ? "in-stock" : "all")}
                className="w-3"
              />
              Em estoque
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={availability === "out-of-stock"}
                onChange={(e) => setAvailability(e.target.checked ? "out-of-stock" : "all")}
                className="w-3"
              />
              Fora de estoque
            </label>
            <label className="flex gap-2">
              <input
                type="checkbox"
                checked={promotion}
                onChange={(e) => setPromotion(e.target.checked)}
                className="w-3"
              />
              Em Promoção
            </label>
          </div>
        </div>

        {/* Intensity Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">Intensidade</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2">
              <input
                onChange={toggleIntensity}
                className="w-3"
                type="checkbox"
                value="Eau de Parfum"
              />
              Eau de Parfum
            </label>
            <label className="flex gap-2">
              <input
                onChange={toggleIntensity}
                className="w-3"
                type="checkbox"
                value="Eau de Toilette"
              />
              Eau de Toilette
            </label>
          </div>
        </div>

        {/* Skin Type Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">Tipo de Pele</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <label className="flex gap-2">
              <input
                onChange={toggleSkinType}
                className="w-3"
                type="checkbox"
                value="Mulheres"
              />
              Perfumes Feminino
            </label>
            <label className="flex gap-2">
              <input
                onChange={toggleSkinType}
                className="w-3"
                type="checkbox"
                value="Homens"
              />
              Perfumes Masculino
            </label>
          </div>
        </div>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIAS</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                onChange={toggleCategory}
                className="w-3"
                type="checkbox"
                value={"Homens"}
              />{" "}
              Homens
            </p>
            <p className="flex gap-2">
              <input
                onChange={toggleCategory}
                className="w-3"
                type="checkbox"
                value={"Mulheres"}
              />{" "}
              Mulheres
            </p>
            <p className="flex gap-2">
              <input
                onChange={toggleCategory}
                className="w-3"
                type="checkbox"
                value={"Outros"}
              />{" "}
              Outros
            </p>
          </div>
        </div>
        {/* Sub-Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">TIPO</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                onChange={toggleSubCategory}
                className="w-3"
                type="checkbox"
                value={"Importados"}
              />{" "}
              Importados
            </p>
            <p className="flex gap-2">
              <input
                onChange={toggleSubCategory}
                className="w-3"
                type="checkbox"
                value={"Nacional"}
              />{" "}
              Nacional
            </p>
            <p className="flex gap-2">
              <input
                onChange={toggleSubCategory}
                className="w-3"
                type="checkbox"
                value={"Arabes"}
              />{" "}
              Arabes
            </p>
          </div>
        </div>

        {/* Price Range Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">FAIXA DE PREÇO</p>
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange(prev => ({ ...prev, min: Number(e.target.value) || 0 }))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) || 1000 }))}
                className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <input
              type="range"
              min="0"
              max="1000"
              value={priceRange.max}
              onChange={(e) => setPriceRange(prev => ({ ...prev, max: Number(e.target.value) }))}
              className="w-full"
            />
            <p className="text-xs text-gray-600">R$ {priceRange.min} - R$ {priceRange.max}</p>
          </div>
        </div>

        {/* Rating Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 sm:block ${
            showFilter ? "" : "hidden"
          }`}
        >
          <p className="mb-3 text-sm font-medium">AVALIAÇÃO MÍNIMA</p>
          <div className="flex flex-col gap-2">
            {[0, 1, 2, 3, 4, 5].map((rating) => (
              <label key={rating} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="rating"
                  value={rating}
                  checked={minRating === rating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-3"
                />
                <div className="flex items-center gap-1">
                  {rating === 0 ? (
                    <span className="text-gray-600">Todas as avaliações</span>
                  ) : (
                    <>
                      {[...Array(rating)].map((_, i) => (
                        <span key={i} className="text-yellow-400">★</span>
                      ))}
                      {[...Array(5 - rating)].map((_, i) => (
                        <span key={i} className="text-gray-300">★</span>
                      ))}
                      <span className="text-gray-600 ml-1">e acima</span>
                    </>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
           onClick={() => {
             setCategory([]);
             setSubCategory([]);
             setIntensity([]);
             setSkinType([]);
             setPromotion(false);
             setAvailability("all");
             setPriceRange({ min: 0, max: 1000 });
             setMinRating(0);
           }}
           className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition-colors"
         >
           Limpar Filtros
         </button>
      </div>
      {/* Right side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"NOSSA"} text2={"COLEÇÃO"} />
          {/* Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relevant">Ordenar por: Relevância</option>
            <option value="low-high">Ordenar por: Menor Preço</option>
            <option value="high-low">Ordenar por: Maior Preço</option>
          </select>
        </div>

        {/* Grid Options and Products per Page */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          {/* Grid View Options */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Visualização:</span>
            <div className="flex gap-1">
              {[2, 3, 4, 5, 6].map((cols) => (
                 <button
                   key={cols}
                   onClick={() => setGridColumns(cols)}
                   className={`px-3 py-1 text-xs border rounded ${
                     gridColumns === cols
                       ? 'bg-black text-white border-black'
                       : 'bg-white text-gray-600 border-gray-300 hover:border-black'
                   }`}
                 >
                   {cols}
                 </button>
               ))}
            </div>
          </div>

          {/* Products per Page */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Produtos por página:</span>
            <select
              value={productsPerPage}
              onChange={(e) => {
                setProductsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-300 text-sm px-2 py-1 rounded"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={36}>36</option>
              <option value={48}>48</option>
            </select>
          </div>
        </div>

        {/* Products Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Mostrando {Math.min((currentPage - 1) * productsPerPage + 1, filterProducts.length)} - {Math.min(currentPage * productsPerPage, filterProducts.length)} de {filterProducts.length} produtos
          </p>
        </div>

        {/* Map Products */}
        <div className={`grid gap-4 gap-y-6`} style={{ gridTemplateColumns: `repeat(${gridColumns}, minmax(0, 1fr))` }}>
          {currentProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-8 gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Anterior
            </button>
            
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 2 && page <= currentPage + 2)
              ) {
                return (
                  <button
                     key={page}
                     onClick={() => setCurrentPage(page)}
                     className={`px-3 py-2 border rounded ${
                       currentPage === page
                         ? 'bg-black text-white border-black'
                         : 'border-gray-300 hover:bg-gray-50'
                     }`}
                   >
                     {page}
                   </button>
                );
              } else if (
                page === currentPage - 3 ||
                page === currentPage + 3
              ) {
                return <span key={page} className="px-2">...</span>;
              }
              return null;
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Próxima
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Collection;
