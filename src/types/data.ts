export interface DataRow {
  [key: string]: string | number | null;
}

export interface Dataset {
  filename: string;
  headers: string[];
  data: DataRow[];
  rowCount: number;
}

export interface ColumnInfo {
  name: string;
  type: "string" | "number" | "date";
  sampleValues: (string | number)[];
  uniqueCount: number;
}

export interface AnalysisConfig {
  xColumn: string;
  yColumn: string;
  chartType: "line" | "bar" | "scatter" | "area";
}

export interface ChartData {
  [key: string]: string | number;
}

export interface AnalysisInsight {
  type: "trend" | "correlation" | "summary" | "outlier";
  title: string;
  description: string;
  value?: string | number;
}
