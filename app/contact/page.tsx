import { Mail, MessageCircle, Send } from "lucide-react";

const contactRows = [
  {
    href: "mailto:portfolio@example.com",
    label: "Email",
    meta: "Primary Channel",
    value: "portfolio@example.com",
  },
  {
    href: "#",
    label: "Discord",
    meta: "Social Handle",
    value: "morallyearlgrey",
  },
  {
    href: "#",
    label: "Availability",
    meta: "Current Signal",
    value: "Software / embedded / design systems",
  },
];

export default function Contact() {
  return (
    <main className="relative isolate min-h-[calc(100svh-72px)] overflow-hidden bg-[#080807] px-4 pb-16 pt-20 text-[#f2e5c6] sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,229,198,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(242,229,198,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_68%_24%,rgba(143,43,53,0.18),transparent_34%),linear-gradient(180deg,rgba(8,8,7,0.72),rgba(8,8,7,0.96))]" />
        <div className="archive-scanlines absolute inset-0 opacity-30" />
      </div>

      <section className="relative z-10 mx-auto grid min-h-[72vh] w-full max-w-7xl gap-8 border-y border-[#f2e5c6]/20 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.5fr)] lg:items-center">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
            <span>Contact Sheet</span>
            <span className="h-px flex-1 bg-[#f2e5c6]/14" />
            <span>Direct Line</span>
          </div>
          <h1 className="font-display mt-5 max-w-4xl text-[64px] font-semibold uppercase leading-[0.82] text-[#f2e5c6] sm:text-[104px] lg:text-[132px]">
            Contact Me
          </h1>
          <p className="mt-6 max-w-2xl border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[#f2e5c6]/68 sm:text-base">
            For thoughtful software, embedded systems, design tooling, or
            collaboration notes, send the signal through the channel that fits.
          </p>
        </div>

        <div className="border border-[#f2e5c6]/18 bg-[#080807]/72 p-4 backdrop-blur-sm sm:p-5">
          <div className="flex items-center justify-between border-b border-[#f2e5c6]/14 pb-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/54">
            <span>Open Channels</span>
            <Send aria-hidden="true" className="text-[#8f2b35]" size={14} strokeWidth={1.8} />
          </div>
          <div className="mt-4 grid gap-px border border-[#f2e5c6]/14 bg-[#f2e5c6]/14">
            {contactRows.map((row, index) => (
              <a
                className="group grid gap-3 bg-[#080807] p-4 transition hover:bg-[#0f0e0d]"
                href={row.href}
                key={row.label}
              >
                <div className="flex items-center justify-between text-[9px] font-bold uppercase leading-none">
                  <span className="text-[#8f2b35]">{row.label}</span>
                  <span className="text-[#f2e5c6]/36">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
                <p className="font-display text-3xl font-semibold uppercase leading-none text-[#f2e5c6] transition group-hover:text-[#8f2b35]">
                  {row.value}
                </p>
                <p className="border-t border-[#f2e5c6]/12 pt-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/44">
                  {row.meta}
                </p>
              </a>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-2 gap-px border border-[#f2e5c6]/14 bg-[#f2e5c6]/14 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/52">
            <span className="bg-[#080807] px-3 py-2.5">
              <Mail aria-hidden="true" className="mr-2 inline text-[#8f2b35]" size={13} />
              Async Preferred
            </span>
            <span className="bg-[#080807] px-3 py-2.5 text-right">
              <MessageCircle aria-hidden="true" className="mr-2 inline text-[#8f2b35]" size={13} />
              Replies Soon
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
