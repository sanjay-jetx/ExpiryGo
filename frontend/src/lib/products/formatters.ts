export function formatExpiryDisplay(dateString: string) {
  const expiryDate = new Date(dateString);
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  
  const isExpired = diffMs <= 0;
  
  if (isExpired) {
    return { isExpired: true, compact: "0h", full: "Expired" };
  }
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  let compact = "";
  let full = "";
  
  if (diffDays > 0) {
    compact = `${diffDays}d`;
    full = `${diffDays} day${diffDays > 1 ? 's' : ''}`;
  } else {
    compact = `${diffHours}h`;
    full = `${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  }
  
  return { isExpired: false, compact, full };
}
