import { useMemo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Lightbulb } from "lucide-react";
import { Dataset, AnalysisConfig } from "@/types/data";
import { prepareChartData, generateInsights } from "@/lib/csvParser";

interface DataVisualizationProps {
  dataset: Dataset;
  config: AnalysisConfig;
  onBackToSelection: () => void;
  compact?: boolean;
}

export function DataVisualization({
  dataset,
  config,
  onBackToSelection,
  compact = false,
}: DataVisualizationProps) {
  const chartData = useMemo(
    () => prepareChartData(dataset, config.xColumn, config.yColumn),
    [dataset, config.xColumn, config.yColumn],
  );

  const insights = useMemo(
    () => generateInsights(dataset, config.xColumn, config.yColumn),
    [dataset, config.xColumn, config.yColumn],
  );

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (config.chartType) {
      case "line":
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xColumn}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey={config.yColumn}
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ fill: "#0ea5e9", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: "#0369a1" }}
            />
          </LineChart>
        );

      case "bar":
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xColumn}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar
              dataKey={config.yColumn}
              fill="#0ea5e9"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case "scatter":
        return (
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              dataKey={config.xColumn}
              tick={{ fontSize: 12 }}
              name={config.xColumn}
            />
            <YAxis
              type="number"
              dataKey={config.yColumn}
              tick={{ fontSize: 12 }}
              name={config.yColumn}
            />
            <Tooltip
              cursor={{ strokeDasharray: "3 3" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Scatter dataKey={config.yColumn} fill="#0ea5e9" />
          </ScatterChart>
        );

      case "area":
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={config.xColumn}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Area
              type="monotone"
              dataKey={config.yColumn}
              stroke="#0ea5e9"
              fill="url(#colorGradient)"
              strokeWidth={2}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
              </linearGradient>
            </defs>
          </AreaChart>
        );

      default:
        return null;
    }
  };

  // Compact mode for embedded usage (e.g., in chat)
  if (compact) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">
            {config.xColumn} vs {config.yColumn}
          </h3>
          <Badge variant="secondary" className="bg-brand-100 text-brand-800">
            {config.chartType.toUpperCase()}
          </Badge>
        </div>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-600">
          Showing {chartData.length} data points
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
          <p className="text-gray-600 mt-1">
            {config.xColumn} vs {config.yColumn}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={onBackToSelection}>
            <RefreshCw className="w-4 h-4 mr-2" />
            New Analysis
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="capitalize">
                {config.chartType} Chart
              </CardTitle>
              <CardDescription>
                Visualizing {chartData.length} data points
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-brand-100 text-brand-800">
              {config.chartType.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-96">
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5 text-insight-500" />
            <span>Key Insights</span>
          </CardTitle>
          <CardDescription>
            Automatically generated insights from your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-r from-brand-50 to-insight-50 border border-brand-200 rounded-lg"
              >
                <p className="text-gray-800 font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-brand-600">
                {dataset.rowCount}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Rows</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-brand-600">
                {dataset.headers.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Total Columns</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-brand-600">
                {chartData.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Valid Data Points
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
