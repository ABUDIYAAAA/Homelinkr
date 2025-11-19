import { useState } from "react";

export default function StepProgress({ currentStep, steps }) {
  return (
    <div className="w-80 bg-gray-50 rounded-lg p-8 flex items-center">
      <div className="space-y-1">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : isCompleted
                      ? "bg-gray-900 text-white"
                      : "bg-white text-gray-400 border-2 border-gray-300"
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < steps.length && (
                  <div
                    className={`w-0.5 h-16 mt-1 ${
                      isCompleted ? "bg-gray-900" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>

              <div className="pt-2 pb-6">
                <h3
                  className={`font-medium ${
                    isActive ? "text-gray-900" : "text-gray-600"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
