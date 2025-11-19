import { useState, useRef, useEffect } from "react";
import { useAddressAutocomplete } from "../hooks/useAddressAutocomplete";

export default function AddressAutocomplete({
  value,
  onChange,
  placeholder,
  required = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const {
    query,
    suggestions,
    loading,
    error,
    updateQuery,
    clearSuggestions,
    getPlaceDetails,
  } = useAddressAutocomplete();

  useEffect(() => {
    if (suggestions.length > 0 && query.length >= 2) {
      setIsOpen(true);
    }
  }, [suggestions, query]);

  useEffect(() => {
    if (value !== query) {
      updateQuery(value || "");
    }
  }, [value]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    updateQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  const handleSuggestionSelect = async (suggestion) => {
    const selectedAddress = suggestion.description;
    updateQuery(selectedAddress);
    onChange(selectedAddress);
    setIsOpen(false);
    clearSuggestions();

    if (suggestion.place_id) {
      try {
        const placeDetails = await getPlaceDetails(suggestion.place_id);
        if (placeDetails && placeDetails.formatted_address) {
          updateQuery(placeDetails.formatted_address);
          onChange(placeDetails.formatted_address);
        }
      } catch (err) {
        console.error("Error fetching place details:", err);
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle input focus
  const handleFocus = () => {
    if (suggestions.length > 0 || query.length >= 2) {
      setIsOpen(true);
    }
  };

  // Handle input blur with delay to allow click on suggestions
  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      setSelectedIndex(-1);
    }, 150);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target) &&
        listRef.current &&
        !listRef.current.contains(event.target)
      ) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseInputClasses =
    "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const inputClasses = `${baseInputClasses} ${className}`;

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        required={required}
        className={inputClasses}
        autoComplete="off"
      />

      {/* Loading indicator */}
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.place_id || index}
              type="button"
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                index === selectedIndex
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-700"
              }`}
              onClick={() => handleSuggestionSelect(suggestion)}
            >
              <div className="flex items-start">
                <div className="shrink-0 mt-1 mr-3">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">
                    {suggestion.main_text || suggestion.description}
                  </div>
                  {suggestion.secondary_text && (
                    <div className="text-xs text-gray-500 truncate">
                      {suggestion.secondary_text}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-red-300 rounded-lg shadow-lg p-3">
          <div className="text-sm text-red-600">{error}</div>
        </div>
      )}

      {/* No results message */}
      {isOpen &&
        !loading &&
        query.length >= 2 &&
        suggestions.length === 0 &&
        !error && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
            <div className="text-sm text-gray-500">
              No addresses found for "{query}"
            </div>
          </div>
        )}
    </div>
  );
}
