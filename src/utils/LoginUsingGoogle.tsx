import { backendPrefix } from "../config";

export async function loginWithGoogle(email: string) {
  const response = await fetch(`${backendPrefix}/auth/google-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
    }),
  });
  const json = await response.json();
  if(!response.ok) throw new Error(json.error || "Login failed");
  window.localStorage.setItem('token', json.token);
  window.location.assign('/dashboard');
}
