import LogoPokebola from "@/components/LogoPokebola";
import Link from "next/link";

export default function Home() {
  return (
    <main className="login-root">
      {/* Ambient Decorative Elements */}
      <div className="orb orb-red" />
      <div className="orb orb-yellow" />
      <div className="orb orb-blue" />
      <div className="grid-overlay" />
      
      <div className="pokeball-deco">
        <div className="pb-top" />
        <div className="pb-bottom" />
        <div className="pb-divider" />
        <div className="pb-button" />
      </div>

      <div className="login-card max-w-2xl text-center">
        <header className="card-header">
          <div className="logo-icon">
            {/* Minimalist Poké Ball Icon */}
            <LogoPokebola/>
          </div>
          <h1 className="card-title text-4xl mb-2">Pokémon Center</h1>
          <p className="card-subtitle text-lg">O seu centro de comando tático para gestão de Pokémon.</p>
        </header>

        <section className="my-8 text-left space-y-4">
          <div className="p-4 rounded-lg bg-white/5 border border-white/10 backdrop-blur-sm">
            <h2 className="text-xl font-bold text-accent mb-2 uppercase tracking-wider">O que é o projeto?</h2>
            <p className="text-muted leading-relaxed">
              O Pokémon Center é uma plataforma avançada desenvolvida para treinadores que buscam 
              organização e eficiência. Aqui você pode registrar seus Pokémon, acompanhar suas estatísticas 
              vitais (como HP e Tipo) e gerenciar sua equipe de forma centralizada e segura.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <span className="text-red font-bold block mb-1">✓ Registro Rápido</span>
              <p className="text-xs text-muted">Adicione novos Pokémon à sua Pokédex pessoal instantaneamente.</p>
            </div>
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <span className="text-yellow font-bold block mb-1">✓ Dashboard Intuitivo</span>
              <p className="text-xs text-muted">Visualize sua equipe completa com interfaces modernas e limpas.</p>
            </div>
          </div>
        </section>

        <footer className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link href="/login" className="submit-btn w-full sm:w-48 no-underline">
            Entrar
          </Link>
          <Link href="/register" className="submit-btn w-full sm:w-48 h-[50px] flex items-center justify-center no-underline text-base font-semibold tracking-wider uppercase">
            Registrar
          </Link>
        </footer>
        
        <p className="mt-8 text-xs text-muted/50 uppercase tracking-[0.2em]">
          &copy; 2026 PokeCenter Protocol - Acesso Restrito a Treinadores Autorizados
        </p>
      </div>
    </main>
  );
}
