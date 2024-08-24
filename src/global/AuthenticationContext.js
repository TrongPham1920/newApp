import {
  useCallback,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "./model/UserProfile.ts";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [profile, setProfile] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);

  const onLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");

    setToken(undefined);
    setProfile(undefined);
    navigate("/");
  }, []);

  const onLogin = (data) => {
    const accessToken = data?.token;
    const profile = UserProfile.jsonToModel(data?.user);

    localStorage.setItem("token", accessToken);
    setToken(accessToken);
    localStorage.setItem("profile", JSON.stringify(profile));
    setProfile(profile);
    navigate("/");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const profileData = localStorage.getItem("profile") || "{}";
    const savedCart = localStorage.getItem("cart");

    if (!!token && !!profileData) {
      setToken(token);
      const profile = UserProfile.jsonToModel(JSON.parse(profileData));
      setProfile(profile);
    }

    if (!!savedCart) {
      setCart(JSON.parse(savedCart));
    }

    setLoading(false);
  }, [navigate]);

  const isAuthenticated = () => {
    return !!token && !!profile;
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      if (existingProduct) {
        const a = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        localStorage.setItem("cart", JSON.stringify(a));
        return a;
      } else {
        const { price, _id, name } = product;
        const a = [...prevCart, { price, _id, quantity: 1, name }];
        localStorage.setItem("cart", JSON.stringify(a));
        return a;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item._id !== productId);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const updateCartQuantity = (productId, quantity) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item._id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        onLogin,
        loading,
        onLogout,
        profile,
        token,
        addToCart,
        removeFromCart,
        clearCart,
        updateCartQuantity,
        cart,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
