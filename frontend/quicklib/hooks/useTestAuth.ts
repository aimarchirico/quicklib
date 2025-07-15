import { getAuth } from '@/config/firebase';

export async function testBackendAuth() {
  const user = getAuth().currentUser;
  if (!user) throw new Error("Not logged in");
  const token = await user.getIdToken();
  console.log("Token:", token);
  const res = await fetch("http://10.0.0.5:8080/api/test-auth", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Backend auth failed");
  return res.json();
}