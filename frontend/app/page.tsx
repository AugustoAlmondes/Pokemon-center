import LogoPokebola from "@/components/LogoPokebola";
import Link from "next/link";
import Image from "next/image";
import HeaderHero from "@/components/HeaderHero";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="orb orb-red" />
        <div className="orb orb-yellow" />
        <div className="orb orb-blue" />
        <div className="grid-overlay" />
        <div className="pokeball-deco" />
      </div>

      <HeaderHero />

      <section className="relative pt-60 pb-20 px-4 z-10">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red/10 border border-red/20 text-red text-[10px] font-bold uppercase tracking-[0.2em] mb-6 animate-pulse">
            Protocolo de Gestão de Pokémon v1.0
          </div>
          <h1 className="text-5xl md:text-7xl font-rajdhani font-bold text-primary mb-6 uppercase tracking-tight leading-none">
            O Centro de Comando do <span className="text-red">Treinador Profissional</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted leading-relaxed mb-10">
            Uma plataforma completa para gerenciamento de Pokémons, permitindo que treinadores registrem, visualizem e gerenciem sua coleção de forma eficiente e intuitiva.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/register" className="submit-btn w-full sm:w-56 text-base no-underline">
              Iniciar Registro
            </Link>
            <div className="flex items-center gap-2 text-muted text-sm font-medium">
              <span className="w-8 h-px bg-white/10" />
              Desenvolvido para Treinadores
              <span className="w-8 h-px bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      <section id="descricao" className="relative py-20 px-4 z-10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-rajdhani font-bold text-primary uppercase tracking-wider flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-red flex items-center justify-center text-white text-sm">01</span>
                Descrição
              </h2>
              <p className="text-muted text-lg leading-relaxed italic">
                "O Pokemon Center é um ecossistema desenvolvido para resolver a necessidade de organização de dados de Pokémons capturados."
              </p>
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-4">
                <p className="text-muted leading-relaxed">
                  O projeto integra dados oficiais da <strong>PokeAPI</strong> para validação e enriquecimento de informações, oferecendo uma interface moderna e amigável.
                </p>
                <ul className="space-y-3">
                  <li className="flex gap-3 text-sm text-muted">
                    <span className="text-red font-bold">●</span>
                    <span><strong>Problema:</strong> Dificuldade em manter um registro organizado e visual de Pokémons.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted">
                    <span className="text-yellow font-bold">●</span>
                    <span><strong>Público-alvo:</strong> Desenvolvedores e entusiastas de Pokémon.</span>
                  </li>
                  <li className="flex gap-3 text-sm text-muted">
                    <span className="text-blue font-bold">●</span>
                    <span><strong>Funcionamento:</strong> NestJS (Backend) + Next.js (Frontend) + PostgreSQL (Database).</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-red to-yellow rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/images/image_2.png"
                  alt="Dashboard Preview"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/80 to-transparent">
                  <span className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Visualização em Tempo Real</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="funcionalidades" className="relative py-20 px-4 z-10 bg-white/2 border-y border-white/5 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-rajdhani font-bold text-primary uppercase tracking-wider inline-flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-yellow text-base-base flex items-center justify-center font-bold text-sm">02</span>
              Funcionalidades
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative group">
              <div className="absolute -inset-1 bg-linear-to-r from-blue to-red rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <Image
                  src="/images/image_3.png"
                  alt="Cadastro de Pokemon"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-4">
              {[
                { title: "Autenticação Segura", desc: "Sistema de login e registro com tokens JWT para proteção total dos seus dados." },
                { title: "Dashboard Interativo", desc: "Visualize sua coleção completa com métricas vitais e cards customizáveis." },
                { title: "Integração PokeAPI", desc: "Sincronização instantânea com dados oficiais para garantir a precisão da sua Pokédex." },
                { title: "Gestão Completa (CRUD)", desc: "Controle total sobre seu inventário: crie, edite ou remova registros com um clique." }
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition-colors group">
                  <h3 className="text-lg font-bold text-accent mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red group-hover:scale-150 transition-transform" />
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="tecnologias" className="relative py-20 px-4 z-10 scroll-mt-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-md">
              <h2 className="text-3xl font-rajdhani font-bold text-primary uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue flex items-center justify-center text-white text-sm">03</span>
                Stack Tecnológica
              </h2>
              <p className="text-muted leading-relaxed mb-8">
                Construído com as ferramentas mais modernas do ecossistema JavaScript para garantir performance, segurança e escalabilidade.
              </p>
              <div className="flex flex-wrap gap-3">
                {["Next.js", "NestJS", "Tailwind CSS", "Prisma", "PostgreSQL", "JWT", "PokeAPI", "Zod", "Shadcn UI"].map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-red mb-1">Frontend</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Next.js 15+</div>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-yellow mb-1">Backend</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">NestJS API</div>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-blue mb-1">Database</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">PostgreSQL</div>
              </div>
              <div className="p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm text-center">
                <div className="text-3xl font-bold text-white mb-1">UI/UX</div>
                <div className="text-xs text-muted-foreground uppercase tracking-widest">Shadcn + CSS</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="demonstracao" className="relative py-20 px-4 z-10 bg-red/[0.02] scroll-mt-16">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-rajdhani font-bold text-primary uppercase tracking-wider mb-2">Interfaces de Sistema</h2>
          <p className="text-muted mb-12">Visualização detalhada das informações técnicas de cada Pokémon.</p>

          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-4 bg-red/10 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000"></div>
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(239,68,68,0.15)] bg-slate-900">
              <Image
                src="/images/image_1.png"
                alt="Informações do Pokemon"
                width={1200}
                height={800}
                className="w-full h-auto shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="como-rodar" className="relative py-20 px-4 z-10 bg-white/3 border-t border-white/5 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="w-12 h-12 rounded-2xl bg-red/20 border border-red/40 flex items-center justify-center text-red font-bold mb-4">⚒</div>
            <h2 className="text-3xl font-rajdhani font-bold text-primary uppercase tracking-wider">Como Rodar o Projeto</h2>
            <p className="text-muted mt-2">Siga estes passos para configurar seu ambiente local de desenvolvimento.</p>
          </div>

          <div className="space-y-4">
            {[
              { step: "01", title: "Configuração do Backend", cmd: "cd backend && pnpm install && pnpm run start:dev" },
              { step: "02", title: "Configuração do Frontend", cmd: "cd frontend && pnpm install && pnpm run dev" },
              { step: "03", title: "Variáveis de Ambiente", cmd: "Configure seu arquivo .env com DATABASE_URL e JWT_SECRET" }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-6 rounded-2xl bg-base/50 border border-white/10 backdrop-blur-xl group hover:border-red/30 transition-all">
                <div className="text-2xl font-rajdhani font-black text-white/10 group-hover:text-red/20 transition-colors">{item.step}</div>
                <div className="space-y-2 text-left flex-1">
                  <h3 className="font-bold text-primary">{item.title}</h3>
                  <code className="block p-3 rounded-lg bg-black/30 border border-white/5 text-xs text-muted font-mono overflow-x-auto">
                    {item.cmd}
                  </code>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="https://github.com/AugustoAlmondes/Pokemon-center" target="_blank" className="inline-flex items-center gap-2 text-sm text-muted hover:text-red transition-colors no-underline uppercase tracking-[0.2em]">
              Ver documentação completa no GitHub <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
