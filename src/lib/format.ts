export const usd = (n: number, d = 0) =>
  (n < 0 ? "−" : "") + "$" + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: d });

export const usdK = (n: number) => {
  const a = Math.abs(n);
  return (n < 0 ? "−" : "") + "$" + (a / 1000).toFixed(a >= 100000 ? 0 : 1) + "k";
};

export const pct = (x: number, d = 1) => (x * 100).toFixed(d) + "%";

export const round1k = (n: number) => Math.round(n / 1000) * 1000;
