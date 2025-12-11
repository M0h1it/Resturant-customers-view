// src/pages/Menu.jsx
import MenuHeader from "../components/MenuHeader";
import OfferBanner from "../components/OfferBanner";
import BottomNav from "../components/BottomNav";
import { useState, useEffect } from "react";
import apiMenu from "../api/apiMenu";

export default function Menu() {
  const categories = ["All", "Appetizers", "Main", "Desserts"];

  const [activeCat, setActiveCat] = useState("All");
  const [menuData, setMenuData] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    fetchMenuData();
  }, []);

  useEffect(() => {
    if (activeCat === "All") setFilteredItems(menuData);
    else setFilteredItems(menuData.filter((item) => item.category === activeCat));
  }, [activeCat, menuData]);

  /** ---------------------------
   * FETCH MENU FROM API (future-proof)
   * Using axios client instead of fetch
   ----------------------------*/
  async function fetchMenuData() {
  try {
    const res = await apiMenu.get("/products");

    const mapped = res.data.products.map((p) => ({
      name: p.title,
      info: p.description,
      img: p.thumbnail,
      category: mapApiCategory(p.category),
    }));

    setMenuData(mapped);
    setFilteredItems(mapped);

  } catch (err) {
    console.error("Menu API Error:", err);
  }
}

  /** Map dummy categories to your 3 categories */
  function mapApiCategory(cat) {
    const c = cat.toLowerCase();

    if (["phone", "laptop", "tops", "shirts", "sunglasses"].some((x) => c.includes(x)))
      return "Appetizers";

    if (["home", "decoration", "furniture", "automotive", "motorcycle", "lighting"]
      .some((x) => c.includes(x)))
      return "Main";

    if (["fragrance", "skincare"].some((x) => c.includes(x)))
      return "Desserts";

    return "Appetizers"; // default
  }

  return (
    <div className="d-flex flex-column vh-100 bg-light">
      <MenuHeader />

      <div className="px-3 mt-2">
        <OfferBanner />
      </div>

      {/* Category Tabs */}
      <div className="d-flex justify-content-around py-2 bg-white mt-2 border-bottom">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCat(cat);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="btn border-0 fw-bold"
            style={{
              color: activeCat === cat ? "red" : "black",
              borderBottom: activeCat === cat ? "3px solid red" : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu List */}
      <div className="overflow-auto px-2" style={{ flexGrow: 1, paddingBottom: "90px" }}>
        {filteredItems.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-4 shadow-sm mt-3 p-3 d-flex justify-content-between align-items-center border"
          >
            <div style={{ width: "70%" }}>
              <h6 className="fw-bold">{item.name}</h6>
              <small>{item.info}</small>
            </div>

            <img
              src={item.img}
              width="75"
              height="75"
              className="rounded-3"
              alt="food"
            />
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
