import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { FileUpload } from "@/components/FileUpload";
import { ColumnSelector } from "@/components/ColumnSelector";
import { DataVisualization } from "@/components/DataVisualization";
import { NaturalLanguageQuery } from "@/components/NaturalLanguageQuery";
import { Dataset, AnalysisConfig } from "@/types/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type AnalysisStep = "upload" | "select" | "visualize";

export default function Analysis() {
  const [currentStep, setCurrentStep] = useState<AnalysisStep>("upload");
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [analysisConfig, setAnalysisConfig] = useState<AnalysisConfig | null>(
    null,
  );

  const handleDatasetLoad = (newDataset: Dataset) => {
    setDataset(newDataset);
    setCurrentStep("select");
  };

  const handleAnalysisStart = (config: AnalysisConfig) => {
    setAnalysisConfig(config);
    setCurrentStep("visualize");
  };

  const handleBackToSelection = () => {
    setCurrentStep("select");
    setAnalysisConfig(null);
  };

  const handleNewUpload = () => {
    setDataset(null);
    setAnalysisConfig(null);
    setCurrentStep("upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { step: "upload", label: "Upload Data", number: 1 },
              { step: "select", label: "Select Columns", number: 2 },
              { step: "visualize", label: "Visualize", number: 3 },
            ].map((item) => (
              <div key={item.step} className="flex items-center">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200
                  ${
                    currentStep === item.step
                      ? "bg-brand-600 text-white shadow-lg"
                      : ["select", "visualize"].includes(currentStep) &&
                          item.step === "upload"
                        ? "bg-success-500 text-white"
                        : currentStep === "visualize" && item.step === "select"
                          ? "bg-success-500 text-white"
                          : "bg-gray-200 text-gray-600"
                  }
                `}
                >
                  {(["select", "visualize"].includes(currentStep) &&
                    item.step === "upload") ||
                  (currentStep === "visualize" && item.step === "select")
                    ? "✓"
                    : item.number}
                </div>
                <span
                  className={`
                  ml-2 text-sm font-medium hidden sm:block
                  ${currentStep === item.step ? "text-brand-600" : "text-gray-500"}
                `}
                >
                  {item.label}
                </span>
                {item.step !== "visualize" && (
                  <div
                    className={`
                    w-8 h-0.5 ml-4 transition-all duration-200
                    ${
                      (["select", "visualize"].includes(currentStep) &&
                        item.step === "upload") ||
                      (currentStep === "visualize" && item.step === "select")
                        ? "bg-success-500"
                        : "bg-gray-200"
                    }
                  `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="animate-fade-in">
          {currentStep === "upload" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Upload Your Data
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Start your analysis by uploading a CSV file. We'll help you
                  explore and visualize your data.
                </p>
              </div>
              <FileUpload onDatasetLoad={handleDatasetLoad} />
            </div>
          )}

          {currentStep === "select" && dataset && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  Analyze Your Data
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose between asking questions in natural language or
                  configuring charts manually.
                </p>
              </div>

              <Tabs defaultValue="natural" className="w-full">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger
                    value="natural"
                    className="flex items-center space-x-2"
                  >
                    <span>🤖 Ask Questions</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="manual"
                    className="flex items-center space-x-2"
                  >
                    <span>⚙️ Manual Setup</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="natural" className="mt-8">
                  <NaturalLanguageQuery
                    dataset={dataset}
                    onVisualizationGenerated={(config) => {
                      setAnalysisConfig(config);
                      setCurrentStep("visualize");
                    }}
                  />
                </TabsContent>

                <TabsContent value="manual" className="mt-8">
                  <ColumnSelector
                    dataset={dataset}
                    onAnalysisStart={handleAnalysisStart}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}

          {currentStep === "visualize" && dataset && analysisConfig && (
            <DataVisualization
              dataset={dataset}
              config={analysisConfig}
              onBackToSelection={handleBackToSelection}
            />
          )}
        </div>
      </div>
    </div>
  );
}
