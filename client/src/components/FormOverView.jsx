export default function FormOverView({ data, onPrev, onSubmit }) {
  const formatPrice = (price, type) => {
    if (!price) return "Not specified";
    return type === "rent" ? `₹${price}/month` : `₹${price}`;
  };

  const formatAmenities = (amenities) => {
    const selected = Object.entries(amenities)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    return selected.length > 0 ? selected.join(", ") : "None selected";
  };

  return (
    <div className="w-full pb-24 min-h-full">
      {/* Step Info */}
      <div className="mb-4 text-sm text-gray-500">Step 4 of 4</div>
      <h1 className="text-3xl font-bold mb-2">Review Your Listing</h1>
      <p className="text-gray-600 mb-8">
        Please review all the information below before submitting your property
        listing.
      </p>

      {/* Overview Cards */}
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Personal Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm text-gray-500">Full Name</span>
              <p className="font-medium">
                {data.personalInfo.fullName || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Phone Number</span>
              <p className="font-medium">
                {data.personalInfo.phoneNumber || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Email</span>
              <p className="font-medium">
                {data.personalInfo.emailAddress || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">City</span>
              <p className="font-medium">
                {data.personalInfo.city || "Not provided"}
              </p>
            </div>
            {data.personalInfo.reasonForSelling && (
              <div className="md:col-span-2">
                <span className="text-sm text-gray-500">
                  Reason for Selling
                </span>
                <p className="font-medium">
                  {data.personalInfo.reasonForSelling}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Property Information */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Property Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500">Property Type</span>
              <p className="font-medium capitalize">
                {data.propertyInfo.propertyType}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Title</span>
              <p className="font-medium">
                {data.propertyInfo.listingTitle || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Address</span>
              <p className="font-medium">
                {data.propertyInfo.address || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Price</span>
              <p className="font-medium text-green-600">
                {formatPrice(
                  data.propertyInfo.price,
                  data.propertyInfo.propertyType
                )}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Area</span>
              <p className="font-medium">
                {data.propertyInfo.squareFeet
                  ? `${data.propertyInfo.squareFeet} sq ft`
                  : "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Bedrooms</span>
              <p className="font-medium">
                {data.propertyInfo.bedrooms || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Bathrooms</span>
              <p className="font-medium">
                {data.propertyInfo.bathrooms || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Furnishing</span>
              <p className="font-medium">{data.propertyInfo.furnishing}</p>
            </div>
          </div>
          {data.propertyInfo.description && (
            <div className="mt-4">
              <span className="text-sm text-gray-500">Description</span>
              <p className="font-medium">{data.propertyInfo.description}</p>
            </div>
          )}

          {/* Property Images */}
          {(data.propertyInfo.thumbnail?.some((img) => img) ||
            data.propertyInfo.images?.some((img) => img)) && (
            <div className="mt-4">
              <span className="text-sm text-gray-500 block mb-2">
                Property Images
              </span>
              <div className="grid grid-cols-3 gap-2">
                {/* Display thumbnail first */}
                {data.propertyInfo.thumbnail
                  ?.filter((img) => img)
                  .map((image, index) => (
                    <div key={`thumb-${index}`} className="relative">
                      <img
                        src={image}
                        alt={`Main Property Image`}
                        className="w-full h-24 object-cover rounded-lg border-2 border-blue-500"
                      />
                      <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded">
                        Main
                      </span>
                    </div>
                  ))}
                {/* Display additional images */}
                {data.propertyInfo.images
                  ?.filter((img) => img)
                  .map((image, index) => (
                    <img
                      key={`img-${index}`}
                      src={image}
                      alt={`Property ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Location & Amenities */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Location & Amenities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <span className="text-sm text-gray-500">Coordinates</span>
              <p className="font-medium">
                {data.moreInfo.latitude && data.moreInfo.longitude
                  ? `${data.moreInfo.latitude}, ${data.moreInfo.longitude}`
                  : "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">City</span>
              <p className="font-medium">
                {data.moreInfo.city || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">State</span>
              <p className="font-medium">
                {data.moreInfo.state || "Not provided"}
              </p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Country</span>
              <p className="font-medium">
                {data.moreInfo.country || "Not provided"}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm text-gray-500">Amenities</span>
              <p className="font-medium">
                {formatAmenities(data.moreInfo.amenities)}
              </p>
            </div>
          </div>

          {data.moreInfo.locationHighlights && (
            <div className="mt-4">
              <span className="text-sm text-gray-500">Location Highlights</span>
              <p className="font-medium">{data.moreInfo.locationHighlights}</p>
            </div>
          )}

          {data.moreInfo.includedAmenities && (
            <div className="mt-4">
              <span className="text-sm text-gray-500">Included Amenities</span>
              <p className="font-medium">{data.moreInfo.includedAmenities}</p>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mt-8 mb-8">
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="px-8 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition-colors"
          >
            Back to Edit
          </button>
          <button
            onClick={onSubmit}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors flex items-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Submit Listing
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          By submitting, you agree to our terms and conditions for property
          listings.
        </p>
      </div>
    </div>
  );
}
