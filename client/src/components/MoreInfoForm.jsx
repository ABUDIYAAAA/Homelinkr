export default function MoreInfoForm({ data, onUpdate, onNext, onPrev }) {
  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleAmenityChange = (amenity, checked) => {
    onUpdate({
      amenities: {
        ...data.amenities,
        [amenity]: checked,
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  const defaultAmenities = {
    parking: false,
    gym: false,
    pool: false,
    garden: false,
    elevator: false,
    security: false,
    powerBackup: false,
    airConditioning: false,
  };

  const amenities = data.amenities || defaultAmenities;

  return (
    <div className="w-full pb-24 min-h-full">
      {/* Step Info */}
      <div className="mb-4 text-sm text-gray-500">Step 3 of 4</div>

      <h1 className="text-3xl font-bold mb-2">Additional Details</h1>
      <p className="text-gray-600 mb-8">
        Provide location coordinates and amenities to help buyers find your
        property.
      </p>

      {/* Main Form Card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Location Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude
                </label>
                <input
                  type="text"
                  value={data.latitude || ""}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  placeholder="e.g., 28.6139"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude
                </label>
                <input
                  type="text"
                  value={data.longitude || ""}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  placeholder="e.g., 77.2090"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={data.state || ""}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="e.g., Delhi"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={data.country || ""}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="e.g., India"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Property Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Object.keys(amenities).map((key) => (
                <label
                  key={key}
                  className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={amenities[key] || false}
                    onChange={(e) => handleAmenityChange(key, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="capitalize text-sm font-medium">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Highlights
              </label>
              <textarea
                value={data.locationHighlights || ""}
                onChange={(e) =>
                  handleChange("locationHighlights", e.target.value)
                }
                placeholder="e.g., Near metro station, close to schools and malls, quiet neighborhood..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Included Amenities
              </label>
              <textarea
                value={data.includedAmenities || ""}
                onChange={(e) =>
                  handleChange("includedAmenities", e.target.value)
                }
                placeholder="e.g., Maintenance charges included, electricity backup, water supply 24/7..."
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
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
