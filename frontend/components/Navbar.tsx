"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar-root">
      <div className="navbar-container">
        <Link href="/dashboard" className="navbar-brand">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="15" stroke="currentColor" strokeWidth="2" />
            <path d="M1 16h10.5M20.5 16H31" stroke="currentColor" strokeWidth="2" />
            <path d="M1 16C1 8.82 7.82 3 16 3s15 5.82 15 13" stroke="currentColor" strokeWidth="2" fill="var(--red)" />
            <circle cx="16" cy="16" r="4" fill="var(--bg-base)" stroke="currentColor" strokeWidth="2" />
            <circle cx="16" cy="16" r="2" fill="currentColor" />
          </svg>
          <span>Pokémon Center</span>
        </Link>
        
        <nav className="navbar-links">
          {user ? (
            <>
              <span className="navbar-user">Treinador(a) {user.name || user.email?.split("@")[0] || ""}</span>
              <button onClick={logout} className="navbar-btn navbar-btn--danger">
                Sair
              </button>
            </>
          ) : (
            <Link href="/login" className="navbar-btn">
              Entrar
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
