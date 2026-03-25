export interface MealRecord {
  id: number;
  date: string;
  employeeName: string;
  breakfast: 0 | 1;
  lunch: 0 | 1;
  dinner: 0 | 1;
  multiplier: 1 | 2;
  total: number;
}

export interface AppendResult {
  success: boolean;
  id?: number;
  error?: string;
}

export class GoogleSheetsService {
  private scriptUrl: string;

  constructor() {
    this.scriptUrl = process.env.APPS_SCRIPT_URL || '';
  }

  async getNextId(): Promise<number> {
    return 0;
  }

  async appendMealRecord(record: MealRecord): Promise<AppendResult> {
    return this.appendMealRecords([record]);
  }

  async ensureEmployeeInSummary(employeeName: string): Promise<AppendResult> {
    if (!this.scriptUrl) {
      return { success: false, error: 'APPS_SCRIPT_URL chưa được cấu hình' };
    }
    try {
      const params = new URLSearchParams();
      params.set('data', JSON.stringify({ action: 'ensureEmployee', employeeName }));
      const response = await fetch(this.scriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
        redirect: 'follow',
      });
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        return json.success ? { success: true } : { success: false, error: json.error };
      } catch {
        return response.ok ? { success: true } : { success: false, error: text.slice(0, 100) };
      }
    } catch (error) {
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async appendMealRecords(records: MealRecord[]): Promise<AppendResult> {
    if (!this.scriptUrl) {
      return { success: false, error: 'APPS_SCRIPT_URL chưa được cấu hình' };
    }

    const payload = records.map((r) => ({
      date: r.date,
      employeeName: r.employeeName,
      breakfast: r.breakfast,
      lunch: r.lunch,
      dinner: r.dinner,
      multiplier: r.multiplier,
      total: r.total,
    }));

    const maxRetries = 2;
    let lastError = '';

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const params = new URLSearchParams();
        params.set('data', JSON.stringify(payload));

        const response = await fetch(this.scriptUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
          redirect: 'follow',
        });

        const text = await response.text();
        console.log(`[GoogleSheets] attempt ${attempt} status=${response.status} body=${text.slice(0, 200)}`);

        let json: { success: boolean; count?: number; id?: number; error?: string };
        try {
          json = JSON.parse(text);
        } catch {
          if (response.ok) return { success: true };
          lastError = `Non-JSON response: ${text.slice(0, 100)}`;
          continue;
        }

        if (json.success) return { success: true };
        lastError = json.error || 'Apps Script returned success=false';
      } catch (error) {
        lastError = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[GoogleSheets] attempt ${attempt} error:`, error);
      }

      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 2000));
      }
    }

    return { success: false, error: lastError };
  }
}
