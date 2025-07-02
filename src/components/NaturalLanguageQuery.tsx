import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Send,
  Sparkles,
  TrendingUp,
  BarChart3,
  MessageCircle,
  Lightbulb,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dataset } from "@/types/data";
import {
  processNaturalLanguageQuery,
  QueryResult,
  QueryContext,
} from "@/lib/queryProcessor";
import { DataVisualization } from "./DataVisualization";

interface NaturalLanguageQueryProps {
  dataset: Dataset | null;
  onVisualizationGenerated?: (config: {
    xColumn: string;
    yColumn: string;
    chartType: "bar" | "line" | "scatter" | "area";
  }) => void;
}

interface QueryMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  result?: QueryResult;
  timestamp: Date;
}

export function NaturalLanguageQuery({
  dataset,
  onVisualizationGenerated,
}: NaturalLanguageQueryProps) {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<QueryMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmitQuery = async () => {
    if (!query.trim()) return;

    const userMessage: QueryMessage = {
      id: `user-${Date.now()}`,
      type: "user",
      content: query,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsProcessing(true);
    setQuery("");

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const context: QueryContext = {
      dataset,
    };

    const result = processNaturalLanguageQuery(query, context);

    const assistantMessage: QueryMessage = {
      id: `assistant-${Date.now()}`,
      type: "assistant",
      content: result.response,
      result,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsProcessing(false);

    // If visualization was generated, notify parent
    if (
      result.type === "visualization" &&
      result.columns &&
      onVisualizationGenerated
    ) {
      onVisualizationGenerated({
        xColumn: result.columns.x,
        yColumn: result.columns.y,
        chartType: result.chartType || "bar",
      });
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case "visualization":
        return <TrendingUp className="w-5 h-5" />;
      case "insight":
        return <Lightbulb className="w-5 h-5" />;
      case "summary":
        return <BarChart3 className="w-5 h-5" />;
      case "error":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <MessageCircle className="w-5 h-5" />;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case "visualization":
        return "text-brand-600 bg-brand-100";
      case "insight":
        return "text-insight-600 bg-insight-100";
      case "summary":
        return "text-purple-600 bg-purple-100";
      case "error":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const exampleQuestions = [
    "What's the average sales?",
    "Show revenue trend over time",
    "Compare product categories",
    "Summarize the data",
    "What's the highest value?",
    "Show distribution of prices",
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-insight-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">
                Ask Questions About Your Data
              </CardTitle>
              <CardDescription>
                Use natural language to explore and analyze your dataset
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Query Input */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-3">
            <Input
              placeholder="Ask anything about your data... (e.g., 'What's the average sales?' or 'Show revenue trends')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSubmitQuery()}
              className="flex-1"
              disabled={!dataset || isProcessing}
            />
            <Button
              onClick={handleSubmitQuery}
              disabled={!query.trim() || !dataset || isProcessing}
              className="bg-brand-gradient hover:opacity-90 text-white shadow-lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {!dataset && (
            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center space-x-2 text-amber-800">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Please upload a CSV file first to start asking questions about
                  your data.
                </span>
              </div>
            </div>
          )}

          {/* Example Questions */}
          {dataset && messages.length === 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-3">
                Try these example questions:
              </p>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(question)}
                    className="text-xs border-brand-200 text-brand-700 hover:bg-brand-50"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Messages */}
      {messages.length > 0 && (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={cn(
                "transition-all duration-200",
                message.type === "user"
                  ? "ml-12 bg-brand-50 border-brand-200"
                  : "mr-12",
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                      message.type === "user"
                        ? "bg-brand-600 text-white"
                        : "bg-gray-200 text-gray-700",
                    )}
                  >
                    {message.type === "user" ? "You" : "AI"}
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="prose prose-sm max-w-none">
                      <p className="whitespace-pre-line text-gray-800">
                        {message.content}
                      </p>
                    </div>

                    {/* Query Result */}
                    {message.result && (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Badge
                            className={cn(
                              "flex items-center space-x-1",
                              getResultColor(message.result.type),
                            )}
                          >
                            {getResultIcon(message.result.type)}
                            <span className="capitalize">
                              {message.result.type}
                            </span>
                          </Badge>
                        </div>

                        {/* Visualization */}
                        {message.result.type === "visualization" &&
                          message.result.data &&
                          message.result.columns && (
                            <div className="bg-white rounded-lg border p-4">
                              <DataVisualization
                                dataset={dataset!}
                                config={{
                                  xColumn: message.result.columns.x,
                                  yColumn: message.result.columns.y,
                                  chartType: message.result.chartType || "bar",
                                }}
                                onBackToSelection={() => {}}
                                compact={true}
                              />
                            </div>
                          )}

                        {/* Suggestions */}
                        {message.result.suggestions &&
                          message.result.suggestions.length > 0 && (
                            <div>
                              <Separator className="my-3" />
                              <p className="text-sm text-gray-600 mb-2">
                                You might also ask:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {message.result.suggestions.map(
                                  (suggestion, index) => (
                                    <Button
                                      key={index}
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        handleSuggestionClick(suggestion)
                                      }
                                      className="text-xs h-7 text-brand-600 hover:bg-brand-50"
                                    >
                                      {suggestion}
                                    </Button>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Processing indicator */}
          {isProcessing && (
            <Card className="mr-12">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" />
                  </div>
                  <div className="text-gray-600">
                    Analyzing your question...
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
