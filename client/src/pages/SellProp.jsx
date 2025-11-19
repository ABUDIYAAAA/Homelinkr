import { useState, useEffect } from "react";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";
import StepProgress from "../components/StepProgress";
import PropertyInfoForm from "../components/PropertyInfoForm";
import PersonalInfoForm from "../components/PersonalInfoForm";
import MoreInfoForm from "../components/MoreInfoForm";
import OverView from "../components/FormOverView";
import { useProperty } from "../context/Properties";

export default function SellProp() {
  const auth = useAuth();
  const navigate = useNavigate();
  const { useCreateListing } = useProperty();
  const mutation = useCreateListing();
  useEffect(() => {
    if (!auth.loading && !auth.user) {
      navigate("/login");
    }
  }, [auth.user, auth.loading, navigate]);

  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    // Personal Info
    personalInfo: {
      fullName: "",
      phoneNumber: "",
      emailAddress: "",
      city: "",
      reasonForSelling: "",
    },
    // Property Info
    propertyInfo: {
      propertyListing: "rent",
      propertyType: "house",
      listingTitle: "",
      address: "",
      price: "",
      squareFeet: "",
      bedrooms: "",
      bathrooms: "",
      furnishing: "Fully Furnished",
      description: "",
      thumbnail: [null],
      images: [null, null],
    },
    // More Info
    moreInfo: {
      latitude: "",
      longitude: "",
      city: "",
      state: "",
      country: "",
      amenities: {
        gym: false,
        garage: false,
        garden: false,
      },
      locationHighlights: "",
      includedAmenities: "",
    },
  });

  const steps = [
    {
      title: "Personal Info",
      description: "Provide your personal information",
    },
    {
      title: "Property Info",
      description: "Provide some basic details about the property",
    },
    {
      title: "More info",
      description: "Provide location and amenities of the property",
    },
    {
      title: "Overview",
      description: "Review and confirm your listing",
    },
  ];

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      mutation.mutate(formData);
      navigate("/");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 shrink-0 overflow-y-auto">
        <StepProgress currentStep={currentStep} steps={steps} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8">
          <div className="w-full max-w-4xl mx-auto">
            {currentStep === 1 && (
              <PersonalInfoForm
                data={formData.personalInfo}
                onUpdate={(data) => updateFormData("personalInfo", data)}
                onNext={handleNext}
              />
            )}
            {currentStep === 2 && (
              <PropertyInfoForm
                data={formData.propertyInfo}
                onUpdate={(data) => updateFormData("propertyInfo", data)}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 3 && (
              <MoreInfoForm
                data={formData.moreInfo}
                onUpdate={(data) => updateFormData("moreInfo", data)}
                onNext={handleNext}
                onPrev={handlePrev}
              />
            )}
            {currentStep === 4 && (
              <OverView
                data={formData}
                onPrev={handlePrev}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
