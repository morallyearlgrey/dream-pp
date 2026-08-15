export default function Blog() {
  return (
    <main className="mx-auto flex min-h-[72vh] w-full max-w-6xl items-center px-4 py-20 text-[#f2e5c6] sm:px-6 lg:px-8">
      <section className="relative w-full overflow-hidden border-y border-[#f2e5c6]/18 py-14">
        <div aria-hidden="true" className="archive-scanlines absolute inset-0 opacity-20" />
        <div className="relative">
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#d7b82d]">
            <span>Writing Archive</span>
            <span className="h-px flex-1 bg-[#f2e5c6]/14" />
            <span>Index 04</span>
          </div>
          <h1 className="font-display mt-4 text-[64px] font-semibold uppercase leading-[0.86] text-[#f2e5c6] sm:text-[104px]">
            Blog
          </h1>
          <p className="mt-5 max-w-2xl border-l border-[#d7b82d]/45 pl-4 text-sm font-light leading-7 text-[#f2e5c6]/66 sm:text-base">
            A reserved room for future notes, build logs, essays, and visual
            fragments.
          </p>
        </div>
      </section>
    </main>
  );
}
