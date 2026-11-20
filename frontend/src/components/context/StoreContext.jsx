import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { food_list as initialFoodList } from "../../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [food_list, setFoodList] = useState(initialFoodList || []);
  const [cartItems, setCartItems] = useState({});
  const url = "http://localhost:4000";
  const [token, setToken] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to add to cart on backend:", error.message);
      }
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updated = { ...prev };
      if (updated[itemId] > 1) {
        updated[itemId] -= 1;
      } else {
        delete updated[itemId];
      }
      return updated;
    });

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Failed to remove from cart on backend:", error.message);
      }
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => String(product._id) === String(item));
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartCount = () => {
    let count = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        count += cartItems[item];
      }
    }
    return count;
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (
      typeof image === "string" &&
      (image.startsWith("http://") ||
        image.startsWith("https://") ||
        image.startsWith("data:") ||
        image.startsWith("/src") ||
        image.startsWith("/assets") ||
        image.includes("assets/"))
    ) {
      return image;
    }
    return `${url}/images/${image}`;
  };

  const applyPromoCode = (code) => {
    const cleanCode = (code || "").trim().toUpperCase();
    if (cleanCode === "BITEZY30") {
      setPromoCode(cleanCode);
      setDiscountPercent(30);
      return { success: true, message: "30% discount applied!" };
    } else if (cleanCode === "FREEDEL") {
      setPromoCode(cleanCode);
      setDiscountPercent(10);
      return { success: true, message: "Special promo applied!" };
    } else {
      return { success: false, message: "Invalid promo code. Try 'BITEZY30'" };
    }
  };

  const removePromoCode = () => {
    setPromoCode("");
    setDiscountPercent(0);
  };

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      if (response.data && response.data.data && response.data.data.length > 0) {
        setFoodList(response.data.data);
      }
    } catch (error) {
      // Backend not running or offline; keep initial catalog
      console.log("Serving local food catalog.");
    }
  };

  const loadCartData = async (token) => {
    try {
      const response = await axios.post(
        url + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data && response.data.cartData) {
        setCartItems(response.data.cartData);
      }
    } catch (error) {
      console.error("Failed to load cart data from backend:", error.message);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      if (localStorage.getItem("token")) {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartCount,
    getImageUrl,
    url,
    token,
    setToken,
    searchQuery,
    setSearchQuery,
    promoCode,
    discountPercent,
    applyPromoCode,
    removePromoCode
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
