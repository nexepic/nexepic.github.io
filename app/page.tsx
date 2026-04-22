import Image from "next/image";
import ParticleIcon from "./components/ParticleIcon";

export default function Home() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative h-screen w-screen overflow-hidden font-[family-name:var(--font-geist-sans)]">
      {/* particle canvas background */}
      <ParticleIcon />

      {/* content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center">
        <main className="flex flex-col items-center gap-5">
          <Image
            className="animate-fade-up"
            src="/nexepic.svg"
            alt="Nexepic logo"
            width={200}
            height={38}
            priority
          />
          <p
            className="animate-fade-up-delay text-sm tracking-widest font-[family-name:var(--font-geist-mono)]"
            style={{ color: "var(--text-muted)" }}
          >
            Where code meets intelligence.
          </p>
        </main>
      </div>

      {/* footer */}
      <footer className="absolute bottom-6 left-0 right-0 z-10 text-center">
        <p className="text-xs" style={{ color: "var(--text-dim)" }}>
          &copy; {currentYear} Nexepic
        </p>
      </footer>
    </div>
  );
}
