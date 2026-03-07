"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LogoPokebola from "./LogoPokebola";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar-root">
      <div className="navbar-container">
        <Link href="/dashboard" className="navbar-brand">
          <LogoPokebola />
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
