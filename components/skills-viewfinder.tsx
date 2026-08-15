"use client";

/* eslint-disable @next/next/no-img-element */
import { useState } from "react";
import { skillsSeed } from "@/lib/portfolio-data";

const skillModes = [
  { id: "languages", label: "LANGUAGES", meter: "M01" },
  { id: "frameworks", label: "FRAMEWORKS", meter: "M02" },
  { id: "libraries", label: "LIBRARIES", meter: "M03" },
  { id: "tools", label: "TOOLS", meter: "M04" },
] as const;

type SkillMode = (typeof skillModes)[number];
type SkillCategory = SkillMode["id"];
type SkillItem = {
  category: SkillCategory;
  id: string;
  name: string;
  photo: string;
};

const skillItems: SkillItem[] = skillsSeed.map((skill) => ({
  ...skill,
  category: isSkillCategory(skill.category) ? skill.category : "tools",
}));

function isSkillCategory(value: string): value is SkillCategory {
  return skillModes.some((mode) => mode.id === value);
}

function getSkillMode(category: SkillCategory) {
  return skillModes.find((mode) => mode.id === category) ?? skillModes[0];
}

function getModeCount(category: SkillCategory) {
  return skillItems.filter((skill) => skill.category === category).length;
}

export function SkillsViewfinder() {
  const [selectedId, setSelectedId] = useState(skillItems[0]?.id ?? "");
  const activeSkill = skillItems.find((skill) => skill.id === selectedId) ?? skillItems[0];

  if (!activeSkill) {
    return (
      <main className="editorial-shell flex min-h-[72vh] w-full items-center px-4 py-20 text-[#f2e5c6] sm:px-6 lg:px-8">
        <section className="mx-auto w-full max-w-6xl border-y border-[#f2e5c6]/18 py-14">
          <h1 className="font-display text-[64px] font-semibold uppercase leading-[0.86] text-[#f2e5c6] sm:text-[104px]">
            Skills
          </h1>
        </section>
      </main>
    );
  }

  const activeMode = getSkillMode(activeSkill.category);
  const activeIndex = Math.max(0, skillItems.findIndex((skill) => skill.id === activeSkill.id));

  function selectMode(category: SkillCategory) {
    const modeSkill = skillItems.find((skill) => skill.category === category);

    if (modeSkill) {
      setSelectedId(modeSkill.id);
    }
  }

  return (
    <main className="relative isolate min-h-[calc(100svh-72px)] overflow-x-clip bg-[#080807] px-4 pb-16 pt-20 text-[#f2e5c6] sm:px-6 lg:px-8">
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <img
          alt=""
          className="absolute inset-[-12%] h-[124%] w-[124%] object-cover opacity-20 blur-2xl grayscale brightness-[0.3] contrast-[1.25]"
          src={activeSkill.photo}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.9),rgba(8,8,7,0.78)_48%,rgba(8,8,7,0.95)),linear-gradient(90deg,rgba(8,8,7,0.94),rgba(8,8,7,0.64),rgba(8,8,7,0.94))]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(242,229,198,0.05)_1px,transparent_1px),linear-gradient(180deg,rgba(242,229,198,0.04)_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="archive-scanlines absolute inset-0 opacity-32" />
        <div className="editorial-film-grain absolute inset-0 opacity-60" />
      </div>

      <section className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="grid gap-5 border-y border-[#f2e5c6]/20 py-5 lg:grid-cols-[minmax(220px,0.34fr)_minmax(0,1fr)] lg:items-end">
          <div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase leading-none text-[#8f2b35]">
              <span>Capability Monitor</span>
              <span className="h-px flex-1 bg-[#f2e5c6]/14" />
              <span>Index 05</span>
            </div>
            <h1 className="font-display mt-4 text-[70px] font-semibold uppercase leading-[0.8] text-[#f2e5c6] sm:text-[112px] lg:text-[132px]">
              Skills
            </h1>
          </div>
          <p className="max-w-2xl border-l border-[#8f2b35]/45 pl-4 text-sm font-light leading-7 text-[#f2e5c6]/66 sm:text-base lg:justify-self-end">
            A camera-style technical archive: select a mode, inspect the active
            shot, then scrub the contact sheet to move between skills.
          </p>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1fr)_292px]">
          <section className="border border-[#f2e5c6]/22 bg-[#050505]/88 p-2">
            <div className="flex items-center justify-between gap-3 border-b border-[#f2e5c6]/14 px-2 py-2 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/58 sm:px-3">
              <span className="inline-flex items-center gap-2 text-[#8f2b35]">
                <span className="h-1.5 w-1.5 bg-[#8f2b35]" />
                Rec
              </span>
              <span>{activeMode.label}</span>
              <span>
                Shot {(activeIndex + 1).toString().padStart(2, "0")} /{" "}
                {skillItems.length.toString().padStart(2, "0")}
              </span>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden border border-[#f2e5c6]/18 bg-[#080807] sm:aspect-[16/10] lg:aspect-[16/9]">
              <img
                alt={`${activeSkill.name} skill reference`}
                className="h-full w-full object-cover brightness-[0.82] contrast-[1.16] saturate-[0.72]"
                src={activeSkill.photo}
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.08),rgba(8,8,7,0.16)_45%,rgba(8,8,7,0.72)),linear-gradient(90deg,rgba(8,8,7,0.28),transparent_24%,transparent_76%,rgba(8,8,7,0.32))]" />
              <div className="archive-scanlines absolute inset-0 opacity-20" />

              <span className="absolute left-4 top-4 h-14 w-14 border-l border-t border-[#f2e5c6]/52" />
              <span className="absolute right-4 top-4 h-14 w-14 border-r border-t border-[#f2e5c6]/52" />
              <span className="absolute bottom-4 left-4 h-14 w-14 border-b border-l border-[#f2e5c6]/52" />
              <span className="absolute bottom-4 right-4 h-14 w-14 border-b border-r border-[#f2e5c6]/52" />
              <span className="absolute left-1/2 top-6 h-[calc(100%-3rem)] w-px -translate-x-1/2 bg-[#f2e5c6]/10" />
              <span className="absolute left-6 top-1/2 h-px w-[calc(100%-3rem)] -translate-y-1/2 bg-[#f2e5c6]/10" />
              <span className="absolute left-1/2 top-1/2 h-[34%] w-[42%] -translate-x-1/2 -translate-y-1/2 border border-[#f2e5c6]/16" />

              <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-4 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/58 sm:text-[9px]">
                <span>RAW / Manual</span>
                <span className="text-right">WB 5200K</span>
              </div>

              <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div>
                  <p className="text-[9px] font-bold uppercase leading-none text-[#8f2b35]">
                    {activeMode.label}
                  </p>
                  <h2 className="font-display mt-2 max-w-full break-words text-[46px] font-semibold uppercase leading-[0.84] text-[#f2e5c6] sm:text-[68px] lg:text-[82px]">
                    {activeSkill.name}
                  </h2>
                </div>
                <div className="grid grid-cols-3 gap-px border border-[#f2e5c6]/16 bg-[#f2e5c6]/16 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/68 sm:w-[240px]">
                  <span className="bg-[#080807]/92 px-2 py-2">ISO 400</span>
                  <span className="bg-[#080807]/92 px-2 py-2">F 2.8</span>
                  <span className="bg-[#080807]/92 px-2 py-2">1/125</span>
                </div>
              </div>
            </div>

            <div className="grid gap-px border-t border-[#f2e5c6]/14 bg-[#f2e5c6]/12 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/58 sm:grid-cols-4">
              <span className="bg-[#080807] px-3 py-2.5">Focus / {activeSkill.name}</span>
              <span className="bg-[#080807] px-3 py-2.5">Mode / {activeMode.meter}</span>
              <span className="bg-[#080807] px-3 py-2.5">Archive / Local</span>
              <span className="bg-[#080807] px-3 py-2.5 sm:text-right">State / Selected</span>
            </div>
          </section>

          <aside className="border border-[#f2e5c6]/18 bg-[#080807]/56 p-4 xl:p-5">
            <div className="flex items-center gap-3 border-b border-[#f2e5c6]/14 pb-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/54">
              <span>Camera Modes</span>
              <span className="h-px flex-1 bg-[#f2e5c6]/14" />
            </div>
            <div
              aria-label="Skill category modes"
              className="mt-4 grid gap-px border border-[#f2e5c6]/16 bg-[#f2e5c6]/16"
              role="tablist"
            >
              {skillModes.map((mode) => {
                const active = activeMode.id === mode.id;
                const count = getModeCount(mode.id);

                return (
                  <button
                    aria-selected={active}
                    className={`grid grid-cols-[1fr_auto] items-center gap-3 bg-[#080807] px-3 py-3 text-left text-[10px] font-bold uppercase leading-none transition focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] ${
                      active
                        ? "text-[#f2e5c6] shadow-[inset_3px_0_0_#8f2b35]"
                        : "text-[#f2e5c6]/50 hover:text-[#8f2b35]"
                    }`}
                    disabled={count === 0}
                    key={mode.id}
                    onClick={() => selectMode(mode.id)}
                    role="tab"
                    type="button"
                  >
                    <span>{mode.label}</span>
                    <span className={active ? "text-[#8f2b35]" : "text-[#f2e5c6]/34"}>
                      {count.toString().padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
            <dl className="mt-5 grid border-y border-[#f2e5c6]/14 text-[9px] font-bold uppercase leading-none">
              <div className="grid grid-cols-[92px_1fr] gap-3 border-b border-[#f2e5c6]/10 py-3">
                <dt className="text-[#8f2b35]">Capture</dt>
                <dd className="min-w-0 truncate text-[#f2e5c6]/64">{activeSkill.name}</dd>
              </div>
              <div className="grid grid-cols-[92px_1fr] gap-3 border-b border-[#f2e5c6]/10 py-3">
                <dt className="text-[#8f2b35]">Category</dt>
                <dd className="min-w-0 truncate text-[#f2e5c6]/64">{activeMode.label}</dd>
              </div>
              <div className="grid grid-cols-[92px_1fr] gap-3 py-3">
                <dt className="text-[#8f2b35]">Frame</dt>
                <dd className="min-w-0 truncate text-[#f2e5c6]/64">
                  {(activeIndex + 1).toString().padStart(2, "0")} of{" "}
                  {skillItems.length.toString().padStart(2, "0")}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <section className="mt-5 border-y border-[#f2e5c6]/18 py-4">
          <div className="flex items-center gap-3 text-[9px] font-bold uppercase leading-none text-[#f2e5c6]/54">
            <span className="text-[#8f2b35]">Contact Sheet</span>
            <span className="h-px flex-1 bg-[#f2e5c6]/14" />
            <span>{skillItems.length.toString().padStart(2, "0")} Frames</span>
          </div>
          <div className="mt-4 flex w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {skillItems.map((skill, index) => {
              const active = skill.id === activeSkill.id;
              const mode = getSkillMode(skill.category);

              return (
                <button
                  aria-label={`Select ${skill.name}`}
                  aria-pressed={active}
                  className={`group relative h-[132px] w-[176px] shrink-0 overflow-hidden border bg-[#050505] text-left transition focus-visible:z-10 focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8f2b35] sm:h-[152px] sm:w-[214px] ${
                    active
                      ? "z-10 border-[#8f2b35]/90"
                      : "-ml-px border-[#f2e5c6]/18 grayscale hover:border-[#f2e5c6]/44"
                  }`}
                  key={skill.id}
                  onClick={() => setSelectedId(skill.id)}
                  type="button"
                >
                  <img
                    alt=""
                    aria-hidden="true"
                    className={`h-full w-full object-cover transition duration-300 ${
                      active
                        ? "brightness-[0.84] contrast-[1.12] saturate-[0.8]"
                        : "brightness-[0.56] contrast-[1.2] saturate-[0.24] group-hover:brightness-[0.7]"
                    }`}
                    src={skill.photo}
                  />
                  <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,8,7,0.04),rgba(8,8,7,0.72))]" />
                  {active ? <span className="absolute inset-x-0 top-0 h-1 bg-[#8f2b35]" /> : null}
                  <span className="absolute left-2 right-2 top-2 flex items-center justify-between border-b border-[#f2e5c6]/20 pb-1.5 text-[8px] font-bold uppercase leading-none text-[#f2e5c6]/56">
                    <span>{(index + 1).toString().padStart(2, "0")}</span>
                    <span>{mode.meter}</span>
                  </span>
                  <span className="absolute bottom-2 left-2 right-2 border-t border-[#f2e5c6]/24 pt-2 text-[9px] font-bold uppercase leading-3 text-[#f2e5c6]">
                    {skill.name}
                    <span className="block text-[#8f2b35]">{mode.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
}
