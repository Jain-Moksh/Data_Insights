import { useCallback, useState } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { parseCSV } from "@/lib/csvParser";
import { Dataset } from "@/types/data";

interface FileUploadProps {
  onDatasetLoad: (dataset: Dataset) => void;
  isLoading?: boolean;
}

export function FileUpload({ onDatasetLoad, isLoading }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        setErrorMessage("Please upload a CSV file");
        setUploadStatus("error");
        return;
      }

      setUploadStatus("processing");
      setFileName(file.name);
      setErrorMessage("");

      try {
        const text = await file.text();
        const dataset = parseCSV(text, file.name);

        if (dataset.headers.length < 2) {
          throw new Error("CSV must have at least 2 columns for analysis");
        }

        if (dataset.data.length === 0) {
          throw new Error("CSV file contains no data rows");
        }

        setUploadStatus("success");
        setTimeout(() => {
          onDatasetLoad(dataset);
        }, 500);
      } catch (error) {
        setErrorMessage(
          error instanceof Error ? error.message : "Failed to parse CSV file",
        );
        setUploadStatus("error");
      }
    },
    [onDatasetLoad],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFile(e.dataTransfer.files[0]);
      }
    },
    [handleFile],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    },
    [handleFile],
  );

  const resetUpload = () => {
    setUploadStatus("idle");
    setErrorMessage("");
    setFileName("");
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        <div
          className={cn(
            "relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200",
            dragActive
              ? "border-brand-500 bg-brand-50"
              : uploadStatus === "success"
                ? "border-success-500 bg-success-50"
                : uploadStatus === "error"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-brand-400 hover:bg-brand-50/50",
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".csv"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading || uploadStatus === "processing"}
          />

          {uploadStatus === "idle" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-brand-gradient rounded-full flex items-center justify-center">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload your CSV file
                </h3>
                <p className="text-gray-600 mb-4">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <Button
                  variant="outline"
                  className="border-brand-300 text-brand-700 hover:bg-brand-50"
                >
                  Choose File
                </Button>
              </div>
            </div>
          )}

          {uploadStatus === "processing" && (
            <div className="space-y-4 animate-pulse">
              <div className="mx-auto w-16 h-16 bg-brand-200 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-brand-600 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Processing {fileName}
                </h3>
                <p className="text-gray-600">Analyzing your data...</p>
              </div>
            </div>
          )}

          {uploadStatus === "success" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-success-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-success-800 mb-2">
                  File uploaded successfully!
                </h3>
                <p className="text-success-600 mb-4">
                  {fileName} is ready for analysis
                </p>
              </div>
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-800 mb-2">
                  Upload failed
                </h3>
                <p className="text-red-600 mb-4">{errorMessage}</p>
                <Button
                  variant="outline"
                  onClick={resetUpload}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-500 text-center">
          <p>Supported format: CSV files only</p>
          <p className="mt-1">Maximum file size: 10MB</p>
        </div>
      </CardContent>
    </Card>
  );
}
