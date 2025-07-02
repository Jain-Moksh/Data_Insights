import { Dataset, ChartData } from "@/types/data";

export interface QueryResult {
  type: "insight" | "visualization" | "summary" | "error";
  title: string;
  response: string;
  data?: ChartData[];
  chartType?: "bar" | "line" | "scatter" | "area" | "pie";
  columns?: { x: string; y: string };
  suggestions?: string[];
}

export interface QueryContext {
  dataset: Dataset | null;
  currentAnalysis?: {
    xColumn: string;
    yColumn: string;
    chartType: string;
  };
}

// Common query patterns and their handlers
const queryPatterns = [
  {
    patterns: [/what.*average.*(\w+)/i, /average.*of.*(\w+)/i, /mean.*(\w+)/i],
    type: "average" as const,
  },
  {
    patterns: [
      /what.*maximum.*(\w+)/i,
      /highest.*(\w+)/i,
      /max.*(\w+)/i,
      /largest.*(\w+)/i,
    ],
    type: "maximum" as const,
  },
  {
    patterns: [
      /what.*minimum.*(\w+)/i,
      /lowest.*(\w+)/i,
      /min.*(\w+)/i,
      /smallest.*(\w+)/i,
    ],
    type: "minimum" as const,
  },
  {
    patterns: [
      /how many.*(\w+)/i,
      /count.*(\w+)/i,
      /total.*records/i,
      /number.*rows/i,
    ],
    type: "count" as const,
  },
  {
    patterns: [
      /show.*trend.*(\w+)/i,
      /trend.*(\w+)/i,
      /(\w+).*over.*time/i,
      /(\w+).*vs.*(\w+)/i,
    ],
    type: "trend" as const,
  },
  {
    patterns: [
      /compare.*(\w+).*(\w+)/i,
      /(\w+).*vs.*(\w+)/i,
      /relationship.*(\w+).*(\w+)/i,
      /correlation.*(\w+).*(\w+)/i,
    ],
    type: "compare" as const,
  },
  {
    patterns: [
      /summarize.*data/i,
      /overview.*data/i,
      /what.*this.*data/i,
      /describe.*dataset/i,
    ],
    type: "summary" as const,
  },
  {
    patterns: [
      /show.*distribution.*(\w+)/i,
      /distribution.*(\w+)/i,
      /(\w+).*distribution/i,
    ],
    type: "distribution" as const,
  },
];

export function processNaturalLanguageQuery(
  query: string,
  context: QueryContext,
): QueryResult {
  if (!context.dataset) {
    return {
      type: "error",
      title: "No Data Available",
      response:
        "Please upload a CSV file first to analyze your data and ask questions about it.",
      suggestions: [
        "Upload a CSV file",
        "Go to Analysis page",
        "View sample data formats",
      ],
    };
  }

  const dataset = context.dataset;
  const lowerQuery = query.toLowerCase().trim();

  // Find matching pattern
  for (const patternGroup of queryPatterns) {
    for (const pattern of patternGroup.patterns) {
      const match = lowerQuery.match(pattern);
      if (match) {
        return handleQueryType(
          patternGroup.type,
          match,
          query,
          dataset,
          context,
        );
      }
    }
  }

  // If no pattern matches, provide general suggestions
  return {
    type: "insight",
    title: "I'm here to help!",
    response: `I didn't quite understand your question about the data. Here are some examples of what you can ask me:`,
    suggestions: generateQuerySuggestions(dataset),
  };
}

function handleQueryType(
  type: string,
  match: RegExpMatchArray,
  originalQuery: string,
  dataset: Dataset,
  context: QueryContext,
): QueryResult {
  switch (type) {
    case "average":
      return handleAverageQuery(match, dataset);
    case "maximum":
      return handleMaximumQuery(match, dataset);
    case "minimum":
      return handleMinimumQuery(match, dataset);
    case "count":
      return handleCountQuery(match, dataset);
    case "trend":
      return handleTrendQuery(match, dataset);
    case "compare":
      return handleCompareQuery(match, dataset);
    case "summary":
      return handleSummaryQuery(dataset);
    case "distribution":
      return handleDistributionQuery(match, dataset);
    default:
      return {
        type: "error",
        title: "Query Not Supported",
        response: "I'm still learning to understand this type of question.",
        suggestions: generateQuerySuggestions(dataset),
      };
  }
}

function handleAverageQuery(
  match: RegExpMatchArray,
  dataset: Dataset,
): QueryResult {
  const columnName = findBestColumnMatch(match[1], dataset);
  if (!columnName) {
    return {
      type: "error",
      title: "Column Not Found",
      response: `I couldn't find a column matching "${match[1]}" in your data.`,
      suggestions: [`Available columns: ${dataset.headers.join(", ")}`],
    };
  }

  const values = dataset.data
    .map((row) => Number(row[columnName]))
    .filter((val) => !isNaN(val));

  if (values.length === 0) {
    return {
      type: "insight",
      title: "No Numeric Data",
      response: `The column "${columnName}" doesn't contain numeric values that can be averaged.`,
    };
  }

  const average = values.reduce((sum, val) => sum + val, 0) / values.length;

  return {
    type: "insight",
    title: `Average ${columnName}`,
    response: `The average ${columnName} in your dataset is ${average.toFixed(2)}. This is calculated from ${values.length} valid numeric entries.`,
    suggestions: [
      `Show distribution of ${columnName}`,
      `What's the maximum ${columnName}?`,
      `Compare ${columnName} with other columns`,
    ],
  };
}

function handleMaximumQuery(
  match: RegExpMatchArray,
  dataset: Dataset,
): QueryResult {
  const columnName = findBestColumnMatch(match[1], dataset);
  if (!columnName) {
    return {
      type: "error",
      title: "Column Not Found",
      response: `I couldn't find a column matching "${match[1]}" in your data.`,
    };
  }

  const values = dataset.data
    .map((row) => Number(row[columnName]))
    .filter((val) => !isNaN(val));

  if (values.length === 0) {
    return {
      type: "insight",
      title: "No Numeric Data",
      response: `The column "${columnName}" doesn't contain numeric values.`,
    };
  }

  const maximum = Math.max(...values);

  return {
    type: "insight",
    title: `Maximum ${columnName}`,
    response: `The highest ${columnName} in your dataset is ${maximum}. This represents the peak value across all ${values.length} entries.`,
    suggestions: [
      `What's the minimum ${columnName}?`,
      `Show ${columnName} distribution`,
      `Average ${columnName}`,
    ],
  };
}

function handleMinimumQuery(
  match: RegExpMatchArray,
  dataset: Dataset,
): QueryResult {
  const columnName = findBestColumnMatch(match[1], dataset);
  if (!columnName) {
    return {
      type: "error",
      title: "Column Not Found",
      response: `I couldn't find a column matching "${match[1]}" in your data.`,
    };
  }

  const values = dataset.data
    .map((row) => Number(row[columnName]))
    .filter((val) => !isNaN(val));

  if (values.length === 0) {
    return {
      type: "insight",
      title: "No Numeric Data",
      response: `The column "${columnName}" doesn't contain numeric values.`,
    };
  }

  const minimum = Math.min(...values);

  return {
    type: "insight",
    title: `Minimum ${columnName}`,
    response: `The lowest ${columnName} in your dataset is ${minimum}. This represents the minimum value across all ${values.length} entries.`,
    suggestions: [
      `What's the maximum ${columnName}?`,
      `Show ${columnName} distribution`,
      `Average ${columnName}`,
    ],
  };
}

function handleCountQuery(
  match: RegExpMatchArray,
  dataset: Dataset,
): QueryResult {
  return {
    type: "insight",
    title: "Dataset Summary",
    response: `Your dataset contains ${dataset.rowCount} rows and ${dataset.headers.length} columns. Each row represents a unique record in your data.`,
    suggestions: [
      "Summarize the data",
      "Show column details",
      "What are the column types?",
    ],
  };
}

function handleTrendQuery(
  match: RegExpMatchArray,
  dataset: Dataset,
): QueryResult {
  // Try to find two columns for comparison
  let xColumn = "";
  let yColumn = "";

  if (match[2]) {
    // Two columns specified
    xColumn = findBestColumnMatch(match[1], dataset) || "";
    yColumn = findBestColumnMatch(match[2], dataset) || "";
  } else {
    // One column specified, try to find a time-based column for X
    yColumn = findBestColumnMatch(match[1], dataset) || "";
    xColumn = findTimeColumn(dataset) || dataset.headers[0];
  }

  if (!xColumn || !yColumn) {
    return {
      type: "insight",
      title: "Columns for Trend Analysis",
      response: `To show trends, I need two columns to compare. Available columns: ${dataset.headers.join(", ")}`,
      suggestions: [
        `Compare ${dataset.headers[0]} vs ${dataset.headers[1] || dataset.headers[0]}`,
        "Summarize the data",
      ],
    };
  }

  const chartData = dataset.data
    .filter((row) => row[xColumn] !== null && row[yColumn] !== null)
    .slice(0, 50) // Limit for performance
    .map((row) => ({
      [xColumn]: row[xColumn],
      [yColumn]: row[yColumn],
      x: row[xColumn],
      y: row[yColumn],
    }));

  return {
    type: "visualization",
    title: `Trend: ${yColumn} vs ${xColumn}`,
    response: `Here's the trend showing how ${yColumn} varies with ${xColumn}. The visualization includes ${chartData.length} data points.`,
    data: chartData,
    chartType: "line",
    columns: { x: xColumn, y: yColumn },
    suggestions: [
      `Show ${yColumn} distribution`,
      `What's the average ${yColumn}?`,
      "Compare with other columns",
    ],
  };
}

function handleCompareQuery(
  match: RegExpMatchArray,
  dataset: Dataset,
): QueryResult {
  const xColumn = findBestColumnMatch(match[1], dataset);
  const yColumn = findBestColumnMatch(match[2], dataset);

  if (!xColumn || !yColumn) {
    return {
      type: "error",
      title: "Columns Not Found",
      response: `I need two valid columns to compare. Available columns: ${dataset.headers.join(", ")}`,
    };
  }

  const chartData = dataset.data
    .filter((row) => row[xColumn] !== null && row[yColumn] !== null)
    .slice(0, 50)
    .map((row) => ({
      [xColumn]: row[xColumn],
      [yColumn]: row[yColumn],
      x: row[xColumn],
      y: row[yColumn],
    }));

  return {
    type: "visualization",
    title: `Comparison: ${yColumn} vs ${xColumn}`,
    response: `Here's a comparison between ${yColumn} and ${xColumn}. The scatter plot shows the relationship between these two variables across ${chartData.length} data points.`,
    data: chartData,
    chartType: "scatter",
    columns: { x: xColumn, y: yColumn },
    suggestions: [
      `Average ${yColumn}`,
      `Maximum ${xColumn}`,
      "Show data distribution",
    ],
  };
}

function handleSummaryQuery(dataset: Dataset): QueryResult {
  const numericColumns = dataset.headers.filter((header) =>
    dataset.data.some((row) => typeof row[header] === "number"),
  );

  const summary = [
    `📊 **Dataset Overview:**`,
    `• ${dataset.rowCount} total records`,
    `• ${dataset.headers.length} columns`,
    `• ${numericColumns.length} numeric columns`,
    ``,
    `📈 **Available Columns:**`,
    ...dataset.headers.map((header) => `• ${header}`),
  ].join("\n");

  return {
    type: "summary",
    title: "Data Summary",
    response: summary,
    suggestions: [
      "Show column distributions",
      "Compare different columns",
      "What's the average of numeric columns?",
      "Find trends in the data",
    ],
  };
}

function handleDistributionQuery(
  match: RegExpMatchArray,
  dataset: Dataset,
): QueryResult {
  const columnName = findBestColumnMatch(match[1], dataset);
  if (!columnName) {
    return {
      type: "error",
      title: "Column Not Found",
      response: `I couldn't find a column matching "${match[1]}" in your data.`,
    };
  }

  // Create distribution data
  const values = dataset.data.map((row) => row[columnName]);
  const distribution = new Map<string, number>();

  values.forEach((value) => {
    const key = String(value);
    distribution.set(key, (distribution.get(key) || 0) + 1);
  });

  // Convert to chart data (top 10 for readability)
  const chartData = Array.from(distribution.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([value, count]) => ({
      category: value,
      count: count,
      x: value,
      y: count,
    }));

  return {
    type: "visualization",
    title: `Distribution of ${columnName}`,
    response: `Here's the distribution of values in ${columnName}. This shows the frequency of each value, helping you understand the data pattern.`,
    data: chartData,
    chartType: "bar",
    columns: { x: "category", y: "count" },
    suggestions: [
      `Average ${columnName}`,
      `Maximum ${columnName}`,
      "Compare with other columns",
    ],
  };
}

function findBestColumnMatch(
  searchTerm: string,
  dataset: Dataset,
): string | null {
  const term = searchTerm.toLowerCase();

  // Exact match
  const exactMatch = dataset.headers.find(
    (header) => header.toLowerCase() === term,
  );
  if (exactMatch) return exactMatch;

  // Partial match
  const partialMatch = dataset.headers.find((header) =>
    header.toLowerCase().includes(term),
  );
  if (partialMatch) return partialMatch;

  // Fuzzy match (contains similar words)
  const fuzzyMatch = dataset.headers.find((header) => {
    const headerWords = header.toLowerCase().split(/[\s_-]+/);
    return headerWords.some(
      (word) => word.includes(term) || term.includes(word),
    );
  });

  return fuzzyMatch || null;
}

function findTimeColumn(dataset: Dataset): string | null {
  const timeKeywords = [
    "date",
    "time",
    "year",
    "month",
    "day",
    "created",
    "updated",
  ];

  return (
    dataset.headers.find((header) =>
      timeKeywords.some((keyword) => header.toLowerCase().includes(keyword)),
    ) || null
  );
}

function generateQuerySuggestions(dataset: Dataset): string[] {
  const numericColumns = dataset.headers.filter((header) =>
    dataset.data.some((row) => typeof row[header] === "number"),
  );

  const suggestions = ["Summarize the data", "How many records are there?"];

  if (numericColumns.length > 0) {
    const firstNumeric = numericColumns[0];
    suggestions.push(
      `What's the average ${firstNumeric}?`,
      `Show ${firstNumeric} distribution`,
    );
  }

  if (dataset.headers.length >= 2) {
    suggestions.push(
      `Compare ${dataset.headers[0]} vs ${dataset.headers[1]}`,
      `Show trend of ${dataset.headers[1]} over ${dataset.headers[0]}`,
    );
  }

  return suggestions;
}
