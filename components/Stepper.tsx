type Step = {
  id: number;
  label: string;
};

type StepperProps = {
  steps: Step[];
  currentStep: number;
};

export function Stepper({ steps, currentStep }: StepperProps) {
  // Build grid columns: [Step][Line][Step][Line][Step][Line][Step]
  const gridCols: string[] = [];
  steps.forEach((_, i) => {
    gridCols.push('auto'); // Step column
    if (i < steps.length - 1) {
      gridCols.push('1fr'); // Connector column
    }
  });

  return (
    <div 
      className="grid grid-rows-[auto_auto] items-center justify-center gap-y-3" 
      style={{ gridTemplateColumns: gridCols.join(' ') }}
    >
      {/* Row 1: Circles and connector lines */}
      {steps.map((step, index) => {
        // Step indicator logic: id <= currentStep = filled green, id > currentStep = unfilled with border
        const isCompletedOrActive = step.id <= currentStep;
        // Connector logic: connector before current step is green, after is gray
        const connectorIsBeforeCurrent = step.id < currentStep;
        
        return (
          <div key={`step-${step.id}`} className="contents">
            {/* Circle */}
            <div className="flex items-center justify-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium ${
                  isCompletedOrActive
                    ? "bg-[#90AB8B] text-white"
                    : "border border-[#90AB8B] text-[#90AB8B] bg-transparent"
                }`}
              >
                {step.id < currentStep ? "✓" : step.id}
              </div>
            </div>
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex items-center justify-center px-3">
                <div
                  className={`h-px flex-1 ${
                    connectorIsBeforeCurrent
                      ? "bg-[#90AB8B]"
                      : "bg-[#E5E7EB]"
                  }`}
                />
              </div>
            )}
          </div>
        );
      })}
      {/* Row 2: Labels */}
      {steps.map((step, index) => (
        <div key={`label-${step.id}`} className="contents">
          {/* Label */}
          <div className="flex items-center justify-center">
            <p
              className={`mt-2 text-xs text-center w-20 ${
                step.id <= currentStep
                  ? "text-[#3B4953] font-bold"
                  : "text-[#9CA3AF]"
              }`}
            >
              {step.label}
            </p>
          </div>
          {/* Empty cell for connector column */}
          {index < steps.length - 1 && (
            <div />
          )}
        </div>
      ))}
    </div>
  );
}

// Default export for backward compatibility
export default Stepper;
