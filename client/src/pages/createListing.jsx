import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });

  const [imageUploadError, setImageUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Upload handler (Cloudinary)
  const handleImageSubmit = async () => {
    if (files.length === 0) return setImageUploadError("Please select an image first");

    if (files.length + formData.imageUrls.length > 6) {
      return setImageUploadError("You can only upload up to 6 images");
    }

    setUploading(true);
    setImageUploadError("");

    try {
      const uploadPromises = files.map((file) => storeImage(file));
      const urls = await Promise.all(uploadPromises);

      setFormData((prev) => ({
        ...prev,
        imageUrls: prev.imageUrls.concat(urls),
      }));

      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setImageUploadError("Image upload failed (max 5MB per image)");
      setUploading(false);
    }
  };

  // ✅ Upload single image to backend → backend uploads to Cloudinary
  const storeImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("https://reat-estate-backend.vercel.app/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include", // 👈 include cookies for auth if required
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Upload failed");
    return data.url;
  };

  // ✅ Remove image from state
  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((_, i) => i !== index),
    }));
  };

  // ✅ Form field change handler
  const handleChange = (e) => {
    const { id, type, value, checked } = e.target;

    if (id === "sale" || id === "rent") {
      setFormData((prev) => ({ ...prev, type: id }));
    } else if (["parking", "furnished", "offer"].includes(id)) {
      setFormData((prev) => ({ ...prev, [id]: checked }));
    } else if (["number", "text", "textarea"].includes(type)) {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  // ✅ Submit listing
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.regularPrice < +formData.discountPrice)
        return setError("Discount price must be lower than regular price");

      setLoading(true);
      setError("");
const res = await fetch('https://reat-estate-backend.vercel.app/api/listing/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // ✅ Add this line
  body: JSON.stringify({
    ...formData,
    userRef: currentUser._id,
  }),
});

      const data = await res.json();
      setLoading(false);

      if (!res.ok || data.success === false) {
        return setError(data.message || "Something went wrong");
      }

      navigate(`/listing/${data._id}`);
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  // ✅ UI
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Create a Listing</h1>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />

          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />

          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />

          {/* Checkboxes */}
          <div className="flex gap-6 flex-wrap">
            {["sale", "rent", "parking", "furnished", "offer"].map((item) => (
              <div key={item} className="flex gap-2">
                <input
                  type="checkbox"
                  id={item}
                  className="w-5"
                  onChange={handleChange}
                  checked={
                    item === "sale" || item === "rent"
                      ? formData.type === item
                      : formData[item]
                  }
                />
                <span className="capitalize">{item}</span>
              </div>
            ))}
          </div>

          {/* Numbers */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedrooms}
              />
              <p>Beds</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathrooms}
              />
              <p>Baths</p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="10000000"
                required
                className="p-3 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular price</p>
                {formData.type === "rent" && (
                  <span className="text-xs">($ / month)</span>
                )}
              </div>
            </div>

            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min="0"
                  max="10000000"
                  required
                  className="p-3 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discounted price</p>
                  {formData.type === "rent" && (
                    <span className="text-xs">($ / month)</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE (Images) */}
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max 6)
            </span>
          </p>

          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              type="button"
              disabled={uploading}
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>

          {imageUploadError && <p className="text-red-700 text-sm">{imageUploadError}</p>}

          {formData.imageUrls.map((url, index) => (
            <div key={url} className="flex justify-between p-3 border items-center">
              <img
                src={url}
                alt="listing"
                className="w-20 h-20 object-contain rounded-lg"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
              >
                Delete
              </button>
            </div>
          ))}

          <button
            disabled={loading || uploading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Creating..." : "Create listing"}
          </button>

          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
