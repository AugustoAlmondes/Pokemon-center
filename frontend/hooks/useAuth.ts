"use client";

import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";

export interface DecodedUser {
  sub?: string; // Standard JWT subject (usually user ID)
  id?: string;
  userId?: string;
  email?: string;
  name?: string;
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<DecodedUser>(token);
      // Aqui podemos opcionalmente verificar o "exp" para ver se expirou.
      setUser(decoded);
    } catch (error) {
      console.warn("Token JWT inválido:", error);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };


  function getUserId() {
    if (!user) return null;
    return user.sub || user.id || user.userId || null;
  }

  return { user, loading, logout, getUserId };
}
