import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ListingItem from "../components/ListingItem";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Base URL fix
  const BASE_URL =
    import.meta.env.MODE === "development"
      ? "http://localhost:3000"
      : "https://reat-estate-backend.vercel.app";

  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  // ==============================
  // 🧭 Fetch Listings
  // ==============================
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true",
        furnished: furnishedFromUrl === "true",
        offer: offerFromUrl === "true",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);

        const searchQuery = urlParams.toString();
        const res = await fetch(`${BASE_URL}/api/listing/get?${searchQuery}`);

        // ✅ handle backend errors clearly
        if (!res.ok) {
          const text = await res.text();
          console.error("❌ Backend Error Response:", text);
          throw new Error(`Failed to fetch listings: ${res.status}`);
        }

        const data = await res.json();
        console.log("✅ Listings fetched:", data);

        if (data.length > 8) setShowMore(true);
        else setShowMore(false);

        setListings(data);
      } catch (err) {
        console.error("⚠️ Fetch error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [location.search]);

  // ==============================
  // ⚙️ Handle Input Change
  // ==============================
  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "all" || id === "rent" || id === "sale") {
      setSidebardata({ ...sidebardata, type: id });
    } else if (id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: value });
    } else if (["parking", "furnished", "offer"].includes(id)) {
      setSidebardata({ ...sidebardata, [id]: checked });
    } else if (id === "sort_order") {
      const sort = value.split("_")[0] || "created_at";
      const order = value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  // ==============================
  // 🔍 Handle Search Submit
  // ==============================
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // ==============================
  // ➕ Show More Button
  // ==============================
  const onShowMoreClick = async () => {
    try {
      const numberOfListings = listings.length;
      const startIndex = numberOfListings;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set("startIndex", startIndex);
      const searchQuery = urlParams.toString();

      const res = await fetch(`${BASE_URL}/api/listing/get?${searchQuery}`);
      if (!res.ok) throw new Error("Failed to load more listings");

      const data = await res.json();
      if (data.length < 9) setShowMore(false);
      setListings([...listings, ...data]);
    } catch (err) {
      console.error("⚠️ Show more fetch error:", err.message);
    }
  };

  // ==============================
  // 🖥️ UI
  // ==============================
  return (
    <div className="flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebardata.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Type:</label>
            {["all", "rent", "sale"].map((type) => (
              <div key={type} className="flex gap-2">
                <input
                  type="checkbox"
                  id={type}
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata.type === type}
                />
                <span>
                  {type === "all"
                    ? "Rent & Sale"
                    : type.charAt(0).toUpperCase() + type.slice(1)}
                </span>
              </div>
            ))}
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold">Amenities:</label>
            {["parking", "furnished"].map((amenity) => (
              <div key={amenity} className="flex gap-2">
                <input
                  type="checkbox"
                  id={amenity}
                  className="w-5"
                  onChange={handleChange}
                  checked={sidebardata[amenity]}
                />
                <span>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultValue={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>

          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95">
            Search
          </button>
        </form>
      </div>

      {/* Listings Section */}
      <div className="flex-1">
        <h1 className="text-3xl font-semibold border-b p-3 text-slate-700 mt-5">
          Listing results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && listings.length === 0 && (
            <p className="text-xl text-slate-700">No listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-700 text-center w-full">
              Loading...
            </p>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}

          {showMore && (
            <button
              onClick={onShowMoreClick}
              className="text-green-700 hover:underline p-7 text-center w-full"
            >
              Show more
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
