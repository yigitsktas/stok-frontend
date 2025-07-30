import { useState } from 'react';
import axios from 'axios';

function App() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [stock, setStock] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('₺');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [filter, setFilter] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchProducts = async () => {
    const res = await axios.get('https://stok-backend-production.up.railway.app/api/products');
    setProducts(res.data);
  };

  const handleLogin = async () => {
    try {
      await axios.post('https://stok-backend-production.up.railway.app/api/login', { username, password });
      setLoggedIn(true);
      fetchProducts();
    } catch {
      alert('Giriş başarısız!');
    }
  };

  const handleAddProduct = async () => {
    if (!name || !unit || !stock || !price || !currency) {
      alert("Tüm alanları doldurun.");
      return;
    }
    await axios.post('https://stok-backend-production.up.railway.app/api/products', {
      name,
      unit,
      stock: +stock,
      price: +price,
      currency
    });
    setName('');
    setUnit('');
    setStock('');
    setPrice('');
    setCurrency('₺');
    setShowModal(false);
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    await axios.delete(`https://stok-backend-production.up.railway.app/api/products/${id}`);
    fetchProducts();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (!loggedIn) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Stok Takip - Giriş</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Kullanıcı Adı</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="admin"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="••••"
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 transition"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">📦 Stok Takip Paneli</h2>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="🔍 Ürün adına göre filtrele..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-md shadow-sm"
          />
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            + Ürün Ekle
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Ürün</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Birim</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Stok</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Fiyat</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Kur</th>
                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">İşlem</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4">{p.unit}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">{Number(p.price).toFixed(2)}</td>
                  <td className="py-3 px-4">{p.currency}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-gray-500">Ürün bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Yeni Ürün Ekle</h3>
            <div className="grid grid-cols-1 gap-3">
              <input
                placeholder="Ürün Adı"
                value={name}
                onChange={e => setName(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                placeholder="Birim (adet/kg)"
                value={unit}
                onChange={e => setUnit(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Stok"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                placeholder="Fiyat"
                value={price}
                onChange={e => setPrice(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              />
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="TRY">₺ (TRY)</option>
                <option value="USD">$ (USD)</option>
                <option value="EUR">€ (EUR)</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                İptal
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;