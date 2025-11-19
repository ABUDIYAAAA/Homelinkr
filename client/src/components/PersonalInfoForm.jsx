import { useEffect } from "react";
import { useAuth } from "../context/Auth";

export default function PersonalInfoForm({ data, onUpdate, onNext }) {
  const { user } = useAuth();

  const handleChange = (field, value) => {
    onUpdate({ [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext();
  };

  useEffect(() => {
    if (user && user.email) {
      const updates = {};

      if (
        user.email &&
        (!data.emailAddress || data.emailAddress !== user.email)
      ) {
        updates.emailAddress = user.email;
      }

      if (user.name && !data.fullName) {
        updates.fullName = user.name;
      }

      if (user.phone && !data.phoneNumber) {
        updates.phoneNumber = user.phone;
      }

      if (Object.keys(updates).length > 0) {
        onUpdate(updates);
      }
    }
  }, [user, data.emailAddress, data.fullName, data.phoneNumber, onUpdate]);

  return (
    <div className="w-full pb-24 min-h-full">
      {/* Step Info */}
      <div className="mb-4 text-sm text-gray-500">Step 1 of 4</div>

      <h1 className="text-3xl font-bold mb-2">Personal Information</h1>
      <p className="text-gray-600 mb-8">
        Please provide your basic information so we can get in touch and verify
        your property listing.
      </p>

      <form onSubmit={handleSubmit} className="w-full">
        {/* Main Form Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Details</h2>
          <p className="text-gray-600 mb-6">
            Fill out the fields below to help us understand your listing better.
          </p>

          <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={data.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                  {user?.phone && (
                    <span className="text-xs text-gray-500 ml-2">
                      (editable)
                    </span>
                  )}
                </label>
                <input
                  type="tel"
                  value={data.phoneNumber || ""}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                  <span className="text-xs text-gray-500 ml-2">
                    (from your account)
                  </span>
                </label>
                <input
                  type="email"
                  value={data.emailAddress || ""}
                  readOnly
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-gray-600"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={data.city || ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="e.g., Mumbai"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Why are you selling your property?
              </label>
              <textarea
                rows={4}
                value={data.reasonForSelling}
                onChange={(e) =>
                  handleChange("reasonForSelling", e.target.value)
                }
                placeholder="Tell us briefly (e.g., relocating, upgrading, financial reasons, etc.)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
