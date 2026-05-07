export interface Metric {
  name: string;
  score: number;
  note: string;
}

export interface AnalysisResult {
  summary: string;
  score: number;
  rationale: string;
  metrics: Metric[];
  suggestions: string[];
}

export interface AnalyzeRequest {
  url: string;
}

export interface AnalyzeResponse {
  result?: AnalysisResult;
  hostname?: string;
  error?: string;
}
