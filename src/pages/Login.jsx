import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Lock, User } from "lucide-react";
import { authService } from "../services/productService";
import { useShop } from "../context/ShopContext";

function Login() {
  const [username, setUsername] = useState("emilys");
  const [password, setPassword] = useState("emilyspass");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/cart";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userData = await authService.login({ username, password });
      login(userData);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Gagal melakukan login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <Lock size={22} />
          </div>
          <h1>Masuk ke Akun</h1>
          <p>Silakan login untuk mengakses halaman keranjang belanja Anda.</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <User size={16} />
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <Lock size={16} />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
              />
            </div>
          </div>

          <button type="submit" className="primary-btn login-submit" disabled={loading}>
            {loading ? "Memverifikasi..." : "Login"}
          </button>
        </form>

        <div className="login-demo-hint">
          <span>Akun Demo DummyJSON:</span>
          <button
            type="button"
            className="demo-fill-btn"
            onClick={() => {
              setUsername("juwan");
              setPassword("juwanpass");
            }}
          >
            Isi Otomatis (juwan / juwanpass)
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;