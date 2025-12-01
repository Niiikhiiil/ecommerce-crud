import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import {
  Edit2,
  Eye,
  PlusCircle,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Tag,
  ArrowUpDown,
} from "lucide-react";

import Modal from "../components/Modal";
import Loader from "../components/Loader";
import { api } from "../services/productAPI";
import ProductView from "../components/ProductView";
import ProductForm from "../components/ProductForm";
import SkeletonRows from "../components/SkeletonRows";

const LS_KEY = "products";

function saveToLS(list) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  } catch {}
}
function loadFromLS() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

async function functionCallWithRetry(fn, attempts = 3, baseDelay = 600) {
  let lastErr;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fn();
      return res;
    } catch (err) {
      lastErr = err;
      const delay = baseDelay * Math.pow(2, i);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastErr;
}

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const [sortBy, setSortBy] = useState("none");

  const [showModal, setShowModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      setError(null);

      const local = loadFromLS();
      if (local.length) {
        setProducts(local);
        setCategories(
          Array.from(new Set(local.map((p) => p.category))).filter(Boolean)
        );
      }

      try {
        const apiData = await functionCallWithRetry(
          () => api.getAllProducts(),
          3,
          500
        );
        const categoryData = await functionCallWithRetry(
          () => api.getCategories(),
          3,
          500
        );
        if (Array.isArray(apiData) && apiData.length) {
          setProducts(apiData);
          setCategories(categoryData);
          saveToLS(apiData);
        }
      } catch (err) {
        setError("Using local data — offline or API error");
        console.warn("Failed to load API products:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // --- helper: optimistic update with rollback on API failure ---
  async function optimisticUpdate({
    applyLocal,
    revertLocal,
    apiCall,
    successMessage,
    failureMessage,
    onSuccess,
  }) {
    // apply local change first
    applyLocal();
    // save to LS immediately
    saveToLS(productsRef.current); // productsRef updated below before calling this function

    try {
      // try API with retry
      const res = await functionCallWithRetry(apiCall, 3, 500);
      if (successMessage) toast.success(successMessage);
      if (onSuccess) onSuccess(res);
      return res;
    } catch (err) {
      // revert local
      revertLocal();
      saveToLS(productsRef.current);
      toast.error(failureMessage || "API failed — changes reverted");
      console.error(err);
      throw err;
    }
  }

  const productsRef = useRef(products);

  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  function updateCategories(list) {
    setCategories(
      Array.from(new Set(list.map((p) => p.category))).filter(Boolean)
    );
  }

  function resetModalState() {
    setLoading(false);
    setShowModal(false);
    setEditing(null);
    setViewProduct(null);
  }

  console.log("productsRef.current", productsRef.current);

  async function handleSubmitProduct(payload) {
    setLoading(true);
    setError(null);

    const prev = productsRef.current;
    console.log("prev", prev);
    console.log("payload", payload);

    if (payload.id) {
      const updatedList = prev.map((p) => (p.id === payload.id ? payload : p));

      try {
        await optimisticUpdate({
          applyLocal: () => {
            setProducts(updatedList);
            productsRef.current = updatedList;
          },
          revertLocal: () => {
            setProducts(prev);
            productsRef.current = prev;
          },
          apiCall: () => api.updateProduct(payload.id, payload),
        });

        toast.success("Product updated successfully");

        updateCategories(productsRef.current);
        saveToLS(productsRef.current);
      } catch (err) {
        toast.error("Update failed — changes reverted");
        console.warn("Update failed:", err);
      } finally {
        resetModalState();
      }

      return;
    }

    const tempId = `temp-${Date.now()}`;
    const newItem = { ...payload, id: tempId };
    const newList = [newItem, ...prev];

    try {
      await optimisticUpdate({
        applyLocal: () => {
          setProducts(newList);
          productsRef.current = newList;
        },
        revertLocal: () => {
          setProducts(prev);
          productsRef.current = prev;
        },
        apiCall: async () => {
          const res = await api.addProduct(payload);
          const actualId = res?.id ?? Date.now();

          const updated = productsRef.current.map((item) =>
            item.id === tempId ? { ...item, id: actualId } : item
          );

          setProducts(updated);
          productsRef.current = updated;

          return res;
        },
      });

      toast.success("Product created successfully");

      // Update categories AFTER add
      updateCategories(productsRef.current);
      saveToLS(productsRef.current);
    } catch (err) {
      toast.error("Create failed — removed locally");
      console.warn("Create failed:", err);
    } finally {
      resetModalState();
    }
  }

  async function handleDelete(id) {
    // SweetAlert confirm
    const result = await Swal.fire({
      title: "Delete Product?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    setError(null);

    // Optimistic removal
    const prev = productsRef.current;
    const newList = prev.filter((p) => p.id !== id);
    setProducts(newList);
    saveToLS(newList);

    toast.success("Product deleted");

    // API call
    try {
      await functionCallWithRetry(() => api.deleteProduct(id), 3, 500);
    } catch (err) {
      // restore if API fails
      setProducts(prev);
      saveToLS(prev);

      toast.error("Delete failed — could not delete on server");

      console.error("Delete API failed:", err);
    }
  }

  // --- Category change uses API when possible, but falls back to LS filter ---
  async function handleCategoryChange(e) {
    const value = e.target.value;
    setSelectedCategory(value);
    setPage(1);
    setLoading(true);
    setError(null);

    if (value === "all") {
      try {
        const apiData = await functionCallWithRetry(
          () => api.getAllProducts(),
          3,
          500
        );
        setProducts(apiData);
        saveToLS(apiData);
        setCategories(
          Array.from(new Set(apiData.map((p) => p.category))).filter(Boolean)
        );
      } catch (err) {
        // fallback to LS
        const local = loadFromLS();
        setProducts(local);
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const data = await functionCallWithRetry(
          () => api.getByCategory(value),
          3,
          500
        );
        setProducts(data);
        saveToLS(data);
      } catch (err) {
        const local = loadFromLS().filter((p) => p.category === value);
        setProducts(local);
      } finally {
        setLoading(false);
      }
    }
  }

  const filtered = products.filter((p) => {
    if (selectedCategory !== "all" && p.category !== selectedCategory)
      return false;
    if (!search) return true;
    const s = search.toLowerCase();
    return [p.title, p.description, p.category].some((f) =>
      (f || "").toLowerCase().includes(s)
    );
  });

  let sorted = [...filtered];
  if (sortBy === "price-asc") sorted.sort((a, b) => a.price - b.price);
  if (sortBy === "price-desc") sorted.sort((a, b) => b.price - a.price);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      {loading && <Loader fullscreen={true} content={"Loading..."} />}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 text-white">
          <h2 className="text-3xl font-bold tracking-tight ">Products</h2>
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditing({});
                  setShowModal(true);
                  setViewProduct(null);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
              >
                <PlusCircle size={18} />{" "}
                <span className="font-medium">Create</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-4 mb-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search
              className="absolute left-3 top-3.5 text-gray-400"
              size={18}
            />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search products..."
              className="border rounded-xl p-3 pl-10 w-full shadow-sm focus:ring-2 
                 focus:ring-blue-500 outline-none transition"
            />
          </div>

          {/* Category + Sort */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            {/* Category */}
            <div className="relative w-full sm:w-auto">
              <Tag
                className="absolute left-3 top-3.5 text-gray-400"
                size={16}
              />
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="border p-3 pl-10 rounded-xl shadow-sm w-full focus:ring-2 
                   focus:ring-blue-500 outline-none transition"
              >
                <option value="all">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="relative w-full sm:w-auto">
              <ArrowUpDown
                className="absolute left-3 top-3.5 text-gray-400"
                size={16}
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-3 pl-10 rounded-xl shadow-sm w-full focus:ring-2 
                   focus:ring-blue-500 outline-none transition"
              >
                <option value="none">Sort</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <SkeletonRows rows={PAGE_SIZE} />
          ) : error && products.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-lg font-semibold mb-2">
                No products available
              </p>
              <p className="text-sm text-gray-600 mb-4">
                You're viewing offline/local data or the API returned no
                products.
              </p>
              <button
                onClick={() => {
                  setEditing({});
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Create first product
              </button>
            </div>
          ) : pageItems.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-lg font-semibold mb-2">No products found</p>
              <p className="text-sm text-gray-600 mb-4">
                Try creating a product or change filters.
              </p>
              <button
                onClick={() => {
                  setEditing({});
                  setShowModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Create product
              </button>
            </div>
          ) : (
            <>
              <table className="w-full text-left border-separate border-spacing-y-2 hidden md:table">
                <thead className="bg-gray-100 rounded-lg">
                  <tr className="text-gray-600 uppercase text-sm tracking-wide">
                    <th className="p-3">Title</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Category</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {pageItems.map((p) => (
                    <tr
                      key={p.id}
                      className="bg-white border rounded-xl shadow-sm hover:shadow-md transition"
                    >
                      <td
                        className="p-3 flex gap-3 items-start"
                        title={p.title}
                      >
                        <img
                          src={p.image || "https://i.pravatar.cc/80"}
                          alt={p.title}
                          className="w-14 h-14 object-cover rounded-lg shadow"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://via.placeholder.com/80?text=No+Image";
                          }}
                        />

                        <div>
                          <div className="font-semibold text-gray-800">
                            {p.title}
                          </div>
                        </div>
                      </td>

                      <td className="p-3 text-gray-700" title={p?.description}>
                        <div className="text-sm text-gray-500">
                          {p.description}
                        </div>
                      </td>
                      <td className="p-3 text-gray-700" title={`₹${p.price}`}>
                        ₹{p.price}
                      </td>
                      <td className="p-3 text-gray-700" title={p.category}>
                        {p.category}
                      </td>

                      <td className="p-3">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => {
                              setViewProduct(p);
                              setShowModal(true);
                              setEditing(null);
                            }}
                            className="px-3 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center gap-1"
                          >
                            <Eye size={16} /> View
                          </button>

                          <button
                            onClick={() => {
                              setEditing(p);
                              setShowModal(true);
                              setViewProduct(null);
                            }}
                            className="px-3 py-1 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200 flex items-center gap-1"
                          >
                            <Edit2 size={15} /> Edit
                          </button>

                          <button
                            onClick={() => handleDelete(p.id)}
                            className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 flex items-center gap-1"
                          >
                            <Trash2 size={15} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="md:hidden flex flex-col gap-4">
                {pageItems.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={p.image || "https://i.pravatar.cc/80"}
                        alt={p.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{p.title}</p>
                        <p
                          className="text-gray-500 text-sm"
                          title={p?.description}
                        >
                          {p.description?.slice(0, 70)}...
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                      <p>
                        <span className="font-semibold">Price:</span> ₹{p.price}
                      </p>
                      <p>
                        <span className="font-semibold">Category:</span>{" "}
                        {p.category}
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <Eye
                        size={20}
                        className="text-gray-600 cursor-pointer"
                        onClick={() => {
                          setViewProduct(p);
                          setShowModal(true);
                          setEditing(null);
                        }}
                      />

                      <Edit2
                        size={20}
                        className="text-blue-500 cursor-pointer"
                        onClick={() => {
                          setEditing(p);
                          setShowModal(true);
                          setViewProduct(null);
                        }}
                      />

                      <Trash2
                        size={20}
                        className="text-red-500 cursor-pointer"
                        onClick={() => handleDelete(p.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-white">
            Page <span className="font-semibold ">{page}</span> of{" "}
            <span className="font-semibold ">{totalPages}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg border bg-white shadow-sm cursor-pointer hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg border bg-white shadow-sm cursor-pointer hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <Modal
            onClose={() => {
              setShowModal(false);
              setEditing(null);
              setViewProduct(null);
            }}
          >
            {viewProduct && <ProductView product={viewProduct} />}
            {editing !== null && (
              <ProductForm
                initial={editing}
                onCancel={() => setShowModal(false)}
                onSubmit={handleSubmitProduct}
                categories={categories}
              />
            )}
          </Modal>
        )}
      </div>
    </>
  );
}
