import { useState } from "react";
import AddressAutocomplete from "./AddressAutocomplete";

export default function PropertyInfoForm({ data, onUpdate, onNext, onPrev }) {
  const [uploadingStates, setUploadingStates] = useState({});

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleImageUpload = (index, file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      // Set loading state
      setUploadingStates((prev) => ({ ...prev, [`image-${index}`]: true }));

      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedImages = [...(data.images || [null, null])];
        updatedImages[index] = e.target?.result;
        onUpdate({ images: updatedImages });
        // Clear loading state
        setUploadingStates((prev) => ({ ...prev, [`image-${index}`]: false }));
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
        setUploadingStates((prev) => ({ ...prev, [`image-${index}`]: false }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleThumbnailUpload = (index, file) => {
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const updatedThumbnail = [...(data.thumbnail || [null])];
        updatedThumbnail[index] = e.target?.result;
        onUpdate({ thumbnail: updatedThumbnail });
      };
      reader.onerror = () => {
        alert("Error reading file. Please try again.");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeThumbnail = (index) => {
    const updatedThumbnail = [...(data.thumbnail || [null])];
    updatedThumbnail[index] = null;
    onUpdate({ thumbnail: updatedThumbnail });
  };

  const removeImage = (index) => {
    const updatedImages = [...(data.images || [null, null])];
    updatedImages[index] = null;
    onUpdate({ images: updatedImages });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <div className="w-full pb-24 min-h-full">
      {/* Step Info */}
      <div className="mb-4 text-sm text-gray-500">Step 2 of 4</div>
      <h1 className="text-3xl font-bold mb-2">Property Information</h1>
      <p className="text-gray-600 mb-8">
        Provide accurate details about your property to attract the right buyers
        or tenants.
      </p>

      {/* Main Form */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <h2 className="text-xl font-semibold mb-6">Basic Details</h2>

          {/* Property Listing Type & Property Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Listing Type
              </label>
              <div className="flex gap-6">
                {["rent", "mortgage"].map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="propertyListing"
                      value={type}
                      checked={data.propertyListing === type}
                      onChange={(e) =>
                        handleChange("propertyListing", e.target.value)
                      }
                      className="text-blue-600 focus:ring-blue-600"
                    />
                    <span className="capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                value={data.propertyType || ""}
                onChange={(e) => handleChange("propertyType", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Property Type</option>
                <option value="house">House</option>
                <option value="flat">Flat/Apartment</option>
                <option value="commercial">Commercial</option>
                <option value="plot">Plot/Land</option>
              </select>
            </div>
          </div>

          {/* Title & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Listing Title
              </label>
              <input
                type="text"
                value={data.listingTitle || ""}
                onChange={(e) => handleChange("listingTitle", e.target.value)}
                placeholder="e.g., Spacious 2BHK Apartment in Delhi"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <AddressAutocomplete
                value={data.address || ""}
                onChange={(value) => handleChange("address", value)}
                placeholder="E.g., 123 MG Road, Delhi"
                required
              />
            </div>
          </div>

          {/* Price/Rent and Square Feet */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {data.propertyListing === "rent"
                  ? "Monthly Rent (₹)"
                  : "Price (₹)"}
              </label>
              <input
                type="number"
                value={data.price || ""}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder={
                  data.propertyListing === "rent"
                    ? "e.g., 25,000"
                    : "e.g., 75,00,000"
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Feet
              </label>
              <input
                type="number"
                value={data.squareFeet || ""}
                onChange={(e) => handleChange("squareFeet", e.target.value)}
                placeholder="e.g., 1200"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={1}
              />
            </div>
          </div>

          {/* Bedrooms, Bathrooms & Furnishing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                value={data.bedrooms || ""}
                onChange={(e) => handleChange("bedrooms", e.target.value)}
                placeholder="e.g., 3"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                value={data.bathrooms || ""}
                onChange={(e) => handleChange("bathrooms", e.target.value)}
                placeholder="e.g., 2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                min={1}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Furnishing
              </label>
              <select
                value={data.furnishing || ""}
                onChange={(e) => handleChange("furnishing", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Furnishing</option>
                <option value="Fully Furnished">Fully Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              value={data.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe your property (location, amenities, etc.)"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Upload Property Images
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(data.thumbnail || [null]).map((preview, index) => (
                <div
                  key={`thumbnail-${index}`}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 relative hover:border-blue-400 transition h-32"
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeThumbnail(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                      <span className="absolute top-2 left-2 text-xs bg-blue-600 text-white px-2 py-1 rounded-md">
                        Main
                      </span>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition w-full h-full">
                      <div className="text-center">
                        <span className="text-2xl">+</span>
                        <div className="text-xs">Upload Main Image</div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleThumbnailUpload(
                            index,
                            e.target.files?.[0] || null
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              ))}
              {(data.images || [null, null]).map((preview, index) => (
                <div
                  key={`image-${index}`}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-4 relative hover:border-blue-400 transition h-32"
                >
                  {preview ? (
                    <>
                      <img
                        src={preview}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <label className="cursor-pointer flex flex-col items-center justify-center text-gray-500 hover:text-blue-600 transition w-full h-full">
                      <div className="text-center">
                        <span className="text-2xl">+</span>
                        <div className="text-xs">
                          Additional Image {index + 1}
                        </div>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(index, e.target.files?.[0] || null)
                        }
                      />
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onPrev}
              className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
