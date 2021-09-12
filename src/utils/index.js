export function sign(v) {
  if (parseFloat(v) >= 0) return "+" + v;
  return v;
}