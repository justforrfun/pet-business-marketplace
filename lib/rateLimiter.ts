type RequestRecord = {
  timestamps: number[];
};

const requestMap = new Map<string, RequestRecord>();

const RATE_LIMIT_WINDOW = 1000;
const MAX_REQUESTS_PER_WINDOW = 5;

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestMap.get(ip);

  if (!record) {
    requestMap.set(ip, { timestamps: [now] });
    return true;
  }

  const recentTimestamps = record.timestamps.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
  );

  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  recentTimestamps.push(now);
  requestMap.set(ip, { timestamps: recentTimestamps });

  return true;
}

export function cleanupOldRecords(): void {
  const now = Date.now();
  for (const [ip, record] of requestMap.entries()) {
    const recentTimestamps = record.timestamps.filter(
      (timestamp) => now - timestamp < RATE_LIMIT_WINDOW
    );
    
    if (recentTimestamps.length === 0) {
      requestMap.delete(ip);
    } else {
      requestMap.set(ip, { timestamps: recentTimestamps });
    }
  }
}

setInterval(cleanupOldRecords, 60000);
