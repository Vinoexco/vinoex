import type { PoolClient } from "pg";

export interface ConvertedPrice {
  priceGbp: number;
  fxRate: number | null;
  fxDate: string | null;
}

function toIsoDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toISOString().slice(0, 10);
}

/**
 * fx_rates_daily stores: 1 GBP = rate units of quote currency.
 * Convert quote currency amount to GBP: amount / rate.
 */
export async function convertToGbp(
  client: PoolClient,
  amount: number,
  currency: string,
  observedAt: string
): Promise<ConvertedPrice | null> {
  const quote = currency.toUpperCase();

  if (quote === "GBP") {
    return {
      priceGbp: roundMoney(amount),
      fxRate: null,
      fxDate: null,
    };
  }

  const observedDate = toIsoDate(observedAt);

  const exact = await client.query<{ rate: string; rate_date: string }>(
    `SELECT rate, rate_date::text
     FROM fx_rates_daily
     WHERE quote = $1 AND rate_date = $2::date
     LIMIT 1`,
    [quote, observedDate]
  );

  if (exact.rows[0]) {
    const rate = Number(exact.rows[0].rate);
    return {
      priceGbp: roundMoney(amount / rate),
      fxRate: rate,
      fxDate: exact.rows[0].rate_date,
    };
  }

  const nearest = await client.query<{ rate: string; rate_date: string }>(
    `SELECT rate, rate_date::text
     FROM fx_rates_daily
     WHERE quote = $1 AND rate_date <= $2::date
     ORDER BY rate_date DESC
     LIMIT 1`,
    [quote, observedDate]
  );

  if (!nearest.rows[0]) {
    return null;
  }

  const rate = Number(nearest.rows[0].rate);
  return {
    priceGbp: roundMoney(amount / rate),
    fxRate: rate,
    fxDate: nearest.rows[0].rate_date,
  };
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}
