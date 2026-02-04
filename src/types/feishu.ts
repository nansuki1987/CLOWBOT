/**
 * Interface for Feishu API responses
 */
export interface FeishuApiResponse {
  code: number;
  msg: string;
  data?: any;
}

/**
 * Interface for permission error details
 */
export interface PermissionError extends Error {
  scope?: string;
  authUrl?: string;
}

/**
 * Checks if an error is a permission-related error
 */
export function isPermissionError(error: Error): error is PermissionError {
  return error.message.includes('Access denied') || 
         error.message.includes('cardkit:card:write');
}

/**
 * Parses Feishu API error message to extract permission details
 */
export function parsePermissionError(errorMessage: string): { scope: string; authUrl?: string } | null {
  const scopeMatch = errorMessage.match(/\[([^\]]+)\]/);
  const urlMatch = errorMessage.match(/https:\/\/[^\s]+/);
  
  if (scopeMatch) {
    return {
      scope: scopeMatch[1],
      authUrl: urlMatch?.[0]
    };
  }
  
  return null;
}
