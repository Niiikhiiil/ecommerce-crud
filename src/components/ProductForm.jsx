import { Edit, FileText, Image, IndianRupee, Tag } from "lucide-react";
import { useState } from "react";

function ProductForm({ initial = {}, onSubmit, onCancel, categories = [] }) {
  const [title, setTitle] = useState(initial.title || "");
  const [price, setPrice] = useState(initial.price || "");
  const [description, setDescription] = useState(initial.description || "");
  const [category, setCategory] = useState(
    initial.category || categories[0] || ""
  );
  const [image, setImage] = useState(
    initial.image || "https://i.pravatar.cc/300"
  );
  console.log("initial", initial);
  function handle(e) {
    e.preventDefault();
    if (!title.trim()) return alert("Title required");
    if (!price || isNaN(Number(price))) return alert("Valid price required");
    const payload = {
      ...initial,
      id: initial.id,
      title: title.trim(),
      price: Number(price),
      description: description.trim(),
      category: category.trim(),
      image,
    };
    onSubmit(payload);
  }

  return (
    <form
      onSubmit={handle}
      className="space-y-4 bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto transition-transform hover:scale-105"
    >
      <h3 className="text-2xl font-bold text-gray-800">
        {initial.id ? "Update Product" : "Create Product"}
      </h3>

      {/* Title */}
      <div className="flex items-center gap-2">
        <Edit className="w-5 h-5 text-indigo-500" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2">
        <IndianRupee className="w-5 h-5 text-green-500" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Description */}
      <div className="flex items-start gap-2">
        <FileText className="w-5 h-5 mt-2 text-yellow-500" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            rows={3}
          />
        </div>
      </div>

      {/* Category */}
      <div className="flex items-center gap-2">
        <Tag className="w-5 h-5 text-purple-500" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            list="cats"
          />
          <datalist id="cats">
            {categories?.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>
      </div>

      {/* Image */}
      <div className="flex items-center gap-2">
        <Image className="w-5 h-5 text-pink-500" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default ProductForm;
