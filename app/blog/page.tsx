export default function Blog() {
  return (
    <main className="mx-auto flex min-h-[72vh] w-full max-w-6xl items-center px-4 py-20 sm:px-6 lg:px-8">
      <section className="w-full border-y border-[#605246]/30 py-16">
        <p className="text-xs font-semibold uppercase text-[#5E1C23]">
          Journal
        </p>
        <h1 className="font-display mt-3 text-5xl font-semibold text-[#211b18] sm:text-7xl">
          Blog
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#605246]">
          A quiet room for future notes, build logs, essays, and visual scraps.
        </p>
      </section>
    </main>
  );
}
