const PASSWORD = "rident123";
const STORAGE_KEY_AUTH = "rident_auth";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function isPasswordValid() {
  const stored = localStorage.getItem(STORAGE_KEY_AUTH);
  if (!stored) return false;
  try {
    const { password, expires } = JSON.parse(stored);
    return password === PASSWORD && Date.now() < expires;
  } catch {
    return false;
  }
}

export function storePassword() {
  const expires = Date.now() + ONE_WEEK_MS;
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify({ password: PASSWORD, expires }));
}

export function promptPassword() {
  if (!isPasswordValid()) {
    const input = prompt("Enter password to view the map:");
    if (input !== PASSWORD) {
      alert("Incorrect password. Access denied.");
      document.body.innerHTML = "<h2 style='text-align:center;margin-top:20%'>Access Denied</h2>";
      throw new Error("Unauthorized");
    }
    storePassword();
  }
}