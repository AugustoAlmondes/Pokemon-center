import Link from "next/link";
import LogoPokebola from "./LogoPokebola";

export default function HeaderHero() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-base/80 backdrop-blur-md border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 no-underline group">
                    <div className="logo-icon w-8 h-8 m-0">
                        <LogoPokebola />
                    </div>
                    <span className="font-rajdhani font-bold text-xl uppercase tracking-wider text-primary group-hover:text-red transition-colors">
                        Pokémon Center
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <a href="#descricao" className="text-sm font-medium text-muted hover:text-primary no-underline transition-colors uppercase tracking-widest">Descrição</a>
                    <a href="#funcionalidades" className="text-sm font-medium text-muted hover:text-primary no-underline transition-colors uppercase tracking-widest">Funcionalidades</a>
                    <a href="#tecnologias" className="text-sm font-medium text-muted hover:text-primary no-underline transition-colors uppercase tracking-widest">Tecnologias</a>
                    <a href="#demonstracao" className="text-sm font-medium text-muted hover:text-primary no-underline transition-colors uppercase tracking-widest">Telas</a>
                    <a href="#como-rodar" className="text-sm font-medium text-muted hover:text-primary no-underline transition-colors uppercase tracking-widest">Como Rodar</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-bold uppercase tracking-wider text-muted hover:text-primary no-underline transition-colors px-4">
                        Entrar
                    </Link>
                    <Link href="/register" className="submit-btn h-7 px-4 text-xs no-underline">
                        Começar
                    </Link>
                </div>
            </nav>
        </header>)
}