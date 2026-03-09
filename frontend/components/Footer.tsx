import LogoPokebola from "./LogoPokebola";

export default function Footer() {
    return (
        <footer className="relative py-12 px-4 z-10 border-t border-white/5 text-center">
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-2">
                        <LogoPokebola />
                        <span className="font-rajdhani font-bold text-lg uppercase tracking-wider">Pokémon Center</span>
                    </div>
                    <p className="text-xs text-muted uppercase tracking-[0.2em]">&copy; 2026 PokeCenter Protocol - Augusto Almondes</p>
                </div>

                <div className="flex gap-6">
                    <a href="https://github.com/AugustoAlmondes" target="_blank" className="text-muted hover:text-primary transition-colors no-underline text-xs uppercase tracking-widest">GitHub</a>
                    <a href="https://www.linkedin.com/in/augusto-almondes/" target="_blank" className="text-muted hover:text-primary transition-colors no-underline text-xs uppercase tracking-widest">LinkedIn</a>
                </div>
            </div>
        </footer>
    )
}