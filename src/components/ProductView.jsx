import { Tag, Info, IndianRupee, Database, Star } from "lucide-react";

function ProductView({ product }) {
  console.log("product", product);
  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-3xl mx-auto md:flex md:gap-6 transition-transform hover:scale-105">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-64 md:w-64 md:h-64 object-cover rounded-lg"
      />
      <div className="mt-4 md:mt-0 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800">{product.title}</h3>
          <p className="flex items-center text-gray-700 mt-2">
            <IndianRupee className="w-4 h-4 mr-1 text-green-500" />
            {product.price}
          </p>
          <p>
            <Star className="inline h-6 w-5" /> : {product?.rating?.rate}
          </p>
          <p>
            <Database className="inline h-6 w-5" /> : {product?.rating?.count}
          </p>
          <p className="text-gray-600 mt-3">{product.description}</p>
        </div>
        <div className="flex items-center mt-4 text-gray-500 text-sm">
          <Tag className="w-4 h-4 mr-1" />
          <span className="mr-4">Category: {product.category}</span>
          <Info className="w-4 h-4 mr-1" />
        </div>
      </div>
    </div>
  );
}

export default ProductView;
