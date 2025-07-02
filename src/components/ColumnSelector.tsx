import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarChart3, LineChart, ScatterChart, AreaChart } from "lucide-react";
import { Dataset, ColumnInfo, AnalysisConfig } from "@/types/data";
import { analyzeColumns } from "@/lib/csvParser";
import { cn } from "@/lib/utils";

interface ColumnSelectorProps {
  dataset: Dataset;
  onAnalysisStart: (config: AnalysisConfig) => void;
}

const chartTypes = [
  {
    value: "bar" as const,
    label: "Bar Chart",
    icon: BarChart3,
    description: "Compare values across categories",
  },
  {
    value: "line" as const,
    label: "Line Chart",
    icon: LineChart,
    description: "Show trends over time",
  },
  {
    value: "scatter" as const,
    label: "Scatter Plot",
    icon: ScatterChart,
    description: "Explore relationships between variables",
  },
  {
    value: "area" as const,
    label: "Area Chart",
    icon: AreaChart,
    description: "Show cumulative values",
  },
];

export function ColumnSelector({
  dataset,
  onAnalysisStart,
}: ColumnSelectorProps) {
  const [xColumn, setXColumn] = useState<string>("");
  const [yColumn, setYColumn] = useState<string>("");
  const [chartType, setChartType] = useState<
    "bar" | "line" | "scatter" | "area"
  >("bar");

  const columnInfo = analyzeColumns(dataset);

  const handleStartAnalysis = () => {
    if (xColumn && yColumn) {
      onAnalysisStart({
        xColumn,
        yColumn,
        chartType,
      });
    }
  };

  const getColumnTypeColor = (type: string) => {
    switch (type) {
      case "number":
        return "bg-blue-100 text-blue-800";
      case "date":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Dataset Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span>Dataset Overview</span>
          </CardTitle>
          <CardDescription>
            {dataset.filename} • {dataset.rowCount} rows •{" "}
            {dataset.headers.length} columns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columnInfo.map((column) => (
              <div
                key={column.name}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 truncate">
                    {column.name}
                  </h4>
                  <Badge className={getColumnTypeColor(column.type)}>
                    {column.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">
                  {column.uniqueCount} unique values
                </p>
                <div className="text-xs text-gray-500">
                  Sample:{" "}
                  {column.sampleValues.slice(0, 3).map(String).join(", ")}
                  {column.sampleValues.length > 3 && "..."}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Column Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Columns for Analysis</CardTitle>
          <CardDescription>
            Choose two columns to create your visualization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                X-Axis (Categories/Time)
              </label>
              <Select value={xColumn} onValueChange={setXColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select X column" />
                </SelectTrigger>
                <SelectContent>
                  {dataset.headers.map((header) => {
                    const info = columnInfo.find((col) => col.name === header);
                    return (
                      <SelectItem key={header} value={header}>
                        <div className="flex items-center space-x-2">
                          <span>{header}</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getColumnTypeColor(info?.type || "string"),
                            )}
                          >
                            {info?.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Y-Axis (Values)
              </label>
              <Select value={yColumn} onValueChange={setYColumn}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Y column" />
                </SelectTrigger>
                <SelectContent>
                  {dataset.headers.map((header) => {
                    const info = columnInfo.find((col) => col.name === header);
                    return (
                      <SelectItem key={header} value={header}>
                        <div className="flex items-center space-x-2">
                          <span>{header}</span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              "text-xs",
                              getColumnTypeColor(info?.type || "string"),
                            )}
                          >
                            {info?.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chart Type Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Chart Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {chartTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setChartType(type.value)}
                    className={cn(
                      "p-4 border rounded-lg text-left transition-all duration-200 hover:border-brand-300",
                      chartType === type.value
                        ? "border-brand-500 bg-brand-50 ring-2 ring-brand-200"
                        : "border-gray-200 hover:bg-gray-50",
                    )}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          chartType === type.value
                            ? "text-brand-600"
                            : "text-gray-600",
                        )}
                      />
                      <span
                        className={cn(
                          "font-medium",
                          chartType === type.value
                            ? "text-brand-900"
                            : "text-gray-900",
                        )}
                      >
                        {type.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <Button
            onClick={handleStartAnalysis}
            disabled={!xColumn || !yColumn}
            className="w-full bg-brand-gradient hover:opacity-90 text-white shadow-lg"
            size="lg"
          >
            Start Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
