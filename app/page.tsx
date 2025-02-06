import Image from "next/image";

export default function Home() {
  const currentYear = new Date().getFullYear();
  return (
    <div
      className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-10 gap-16 sm:p-10 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol
          className="list-inside list-disc text-sm text-center sm:text-left font-[family-name:var(--font-geist-sans)]">
          <li className="mb-2">
            Empowering products with advanced code detection solutions.
          </li>
          <li>
            Cutting-edge tools for optimal performance.
          </li>
        </ol>
        {/*<div className="flex gap-4 items-center flex-col sm:flex-row">*/}
        {/*  <a*/}
        {/*    className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"*/}
        {/*    href=""*/}
        {/*    target="_blank"*/}
        {/*    rel="noopener noreferrer"*/}
        {/*  >*/}
        {/*    <Image*/}
        {/*      className="dark:invert"*/}
        {/*      src="/vercel.svg"*/}
        {/*      alt="Vercel logomark"*/}
        {/*      width={20}*/}
        {/*      height={20}*/}
        {/*    />*/}
        {/*    Deploy now*/}
        {/*  </a>*/}
        {/*  <a*/}
        {/*    className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"*/}
        {/*    href=""*/}
        {/*    target="_blank"*/}
        {/*    rel="noopener noreferrer"*/}
        {/*  >*/}
        {/*    Read our docs*/}
        {/*  </a>*/}
        {/*</div>*/}
      </main>
      <footer className="row-start-3 flex items-center justify-center w-full">
        <p className="text-sm text-center">
          &copy; {currentYear} Nexepic
        </p>
      </footer>
    </div>
  );
}
