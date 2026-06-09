import type { DocumentSummary, DocumentDetail, FindDocumentResult, QuickAnalyzeResult } from '../types/document';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN || 'MWtZN1FWZk95M1BSTHl1WVl6Tk0vUT09';
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || '';

export async function fetchQuickAnalyzeDocuments(limit = 20, offset = 0): Promise<DocumentSummary[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/documents/quick-analyze?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        AppToken: APP_TOKEN
      }
    }
  );

  if (!response.ok) {
    const message = `Lỗi API: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}

export async function fetchDocumentDetail(analysisId: string): Promise<DocumentDetail> {
  const response = await fetch(
    `${API_BASE_URL}/api/v1/documents/quick-analyze/${analysisId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        AppToken: APP_TOKEN,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function findDocument(
  referenceNumber: string,
  files: File[]
): Promise<FindDocumentResult> {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));

  const response = await fetch(
    `${API_BASE_URL}/api/v1/find-document?reference_number=${encodeURIComponent(referenceNumber)}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        AppToken: APP_TOKEN,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function uploadAndAnalyze(files: File[]): Promise<QuickAnalyzeResult> {
  const formData = new FormData();
  files.forEach((f) => formData.append('files', f));

  const response = await fetch(
    `${API_BASE_URL}/api/v1/documents/quick-analyze?company_id=${encodeURIComponent(COMPANY_ID)}`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        AppToken: APP_TOKEN,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
