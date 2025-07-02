import { Dataset, DataRow, ColumnInfo } from "@/types/data";

export function parseCSV(csvText: string, filename: string): Dataset {
  const lines = csvText.trim().split("\n");
  if (lines.length === 0) {
    throw new Error("CSV file is empty");
  }

  // Parse headers
  const headers = parseCSVLine(lines[0]);

  // Parse data rows
  const data: DataRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === headers.length) {
      const row: DataRow = {};
      headers.forEach((header, index) => {
        const value = values[index]?.trim();
        if (value === "" || value === undefined) {
          row[header] = null;
        } else {
          // Try to convert to number if possible
          const numValue = Number(value);
          row[header] = !isNaN(numValue) && value !== "" ? numValue : value;
        }
      });
      data.push(row);
    }
  }

  return {
    filename,
    headers,
    data,
    rowCount: data.length,
  };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result.map((field) => field.replace(/^"|"$/g, ""));
}

export function analyzeColumns(dataset: Dataset): ColumnInfo[] {
  return dataset.headers.map((header) => {
    const values = dataset.data
      .map((row) => row[header])
      .filter((val) => val !== null && val !== undefined);

    const sampleValues = values.slice(0, 5);
    const uniqueValues = new Set(values);

    // Determine column type
    let type: "string" | "number" | "date" = "string";
    if (values.every((val) => typeof val === "number")) {
      type = "number";
    } else if (values.some((val) => !isNaN(Date.parse(String(val))))) {
      type = "date";
    }

    return {
      name: header,
      type,
      sampleValues,
      uniqueCount: uniqueValues.size,
    };
  });
}

export function prepareChartData(
  dataset: Dataset,
  xColumn: string,
  yColumn: string,
): any[] {
  return dataset.data
    .filter((row) => row[xColumn] !== null && row[yColumn] !== null)
    .map((row) => ({
      [xColumn]: row[xColumn],
      [yColumn]: row[yColumn],
      x: row[xColumn],
      y: row[yColumn],
    }))
    .slice(0, 100); // Limit to 100 points for performance
}

export function generateInsights(
  dataset: Dataset,
  xColumn: string,
  yColumn: string,
): string[] {
  const insights: string[] = [];

  const validData = dataset.data.filter(
    (row) => row[xColumn] !== null && row[yColumn] !== null,
  );

  if (validData.length === 0) {
    return ["No valid data found for the selected columns."];
  }

  // Basic statistics
  const yValues = validData
    .map((row) => Number(row[yColumn]))
    .filter((val) => !isNaN(val));

  if (yValues.length > 0) {
    const avg = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
    const max = Math.max(...yValues);
    const min = Math.min(...yValues);

    insights.push(`Average ${yColumn}: ${avg.toFixed(2)}`);
    insights.push(`Range: ${min.toFixed(2)} to ${max.toFixed(2)}`);
    insights.push(`Total data points: ${validData.length}`);
  }

  // Unique values insight
  const uniqueX = new Set(validData.map((row) => row[xColumn])).size;
  insights.push(`${uniqueX} unique values in ${xColumn}`);

  return insights;
}
