import { useProperty } from "../context/Properties";
import PropertyCard from "../components/PropertCard";

export default function Properties() {
  const { useListings } = useProperty();
  const { data: properties, isLoading, error } = useListings();

  if (isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading properties...</span>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-gray-600">Error loading listings</p>
        </div>
      </div>
    );

  if (!properties || properties.length === 0)
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="text-gray-400 mb-2">🏠</div>
          <p className="text-gray-600">No properties found</p>
        </div>
      </div>
    );

  return (
    <>
      {properties.map((property, index) => (
        <PropertyCard key={property.id || index} property={property} />
      ))}
    </>
  );
}
