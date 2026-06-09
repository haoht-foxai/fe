import type { StaffMember } from '../types/document';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const APP_TOKEN = import.meta.env.VITE_APP_TOKEN || 'MWtZN1FWZk95M1BSTHl1WVl6Tk0vUT09';
const COMPANY_ID = import.meta.env.VITE_COMPANY_ID || '';

export async function fetchStaffList(): Promise<StaffMember[]> {
  const url = `${API_BASE_URL}/api/v1/categories/company-tree?company_id=${encodeURIComponent(COMPANY_ID)}&use_cache=true&ai_format=true`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      AppToken: APP_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error(`Lỗi API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}
