// Firebase Functions 보안 미들웨어
export function sanitizeErrorMessages(error: any): string {
  const errorString = String(error.message || error);
  
  // API 키 패턴 제거
  const sanitized = errorString
    .replace(/AIza[0-9A-Za-z-_]{35}/g, '[REDACTED_API_KEY]')
    .replace(/sk-[0-9A-Za-z]{48}/g, '[REDACTED_API_KEY]')
    .replace(/[A-Za-z0-9]{32,}/g, (match) => {
      return '[REDACTED_LONG_STRING]';
    });
  
  return sanitized;
}

export function secureLog(message: string, ...args: any[]): void {
  const sanitizedMessage = sanitizeErrorMessages(message);
  const sanitizedArgs = args.map(arg => {
    if (typeof arg === 'string') {
      return sanitizeErrorMessages(arg);
    }
    if (typeof arg === 'object' && arg !== null) {
      return sanitizeObject(arg);
    }
    return arg;
  });
  
  console.log(sanitizedMessage, ...sanitizedArgs);
}

function sanitizeObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (['apiKey', 'api_key', 'key', 'token', 'secret', 'password'].includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        sanitized[key] = sanitizeErrorMessages(value);
      } else {
        sanitized[key] = sanitizeObject(value);
      }
    }
    return sanitized;
  }
  
  return obj;
}

export function validateEnvironmentSecurity(): void {
  const requiredSecrets = ['GEMINI_API_KEY'];
  
  for (const secret of requiredSecrets) {
    if (!process.env[secret]) {
      throw new Error(`Required environment variable ${secret} is not set`);
    }
    
    if (secret.includes('API_KEY') && process.env[secret]!.length < 10) {
      throw new Error(`Invalid format for ${secret}`);
    }
  }
  
  secureLog('Environment security validation passed');
}

// Rate Limiting for Cloud Functions
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(ip: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now();
  const userRequests = requestCounts.get(ip);
  
  if (!userRequests || now > userRequests.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (userRequests.count >= maxRequests) {
    return false;
  }
  
  userRequests.count++;
  return true;
}