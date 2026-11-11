import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown, Download, Eye, FileText, LayoutTemplate, MoreHorizontal, MousePointer2, PenLine, Save, Sparkles } from "lucide-react";
import { getCVData } from "@/lib/cv-repository";

export const dynamic = "force-dynamic";

const copy = {
  es: {
    navHow: "Cómo funciona",
    navTemplates: "Plantillas",
    navFeatures: "Ventajas",
    open: "Abrir editor",
    eyebrow: "TU TRAYECTORIA, MEJOR PRESENTADA",
    titleOne: "Tu experiencia",
    titleTwo: "merece destacar.",
    intro: "Convierte tu trayectoria en un currículum que hable por ti. Diseña, personaliza y exporta un documento profesional, sin complicaciones.",
    start: "Crear mi currículum",
    explore: "Explorar el producto",
    proofOne: "Edición intuitiva",
    proofTwo: "Vista previa al instante",
    proofThree: "Exportación a PDF",
    sample: "VISTA PREVIA · EJEMPLO",
    sampleRole: "Ingeniera de software",
    sampleSummary: "PERFIL PROFESIONAL",
    sampleText: "Especialista en desarrollo de productos digitales, arquitectura de software y experiencias centradas en las personas.",
    sampleExperience: "EXPERIENCIA",
    samplePosition: "Senior Software Engineer",
    sampleCompany: "Estudio Digital · 2022 — Actualidad",
    sampleEducation: "EDUCACIÓN",
    sampleDegree: "Ingeniería de Software",
    sampleSkills: "HABILIDADES",
    sampleSkillsValue: "TypeScript · React · Arquitectura · APIs",
    sampleContact: "Santo Domingo · hola@ejemplo.com",
    floating: "Cada detalle cuenta.",
    introLabel: "DISEÑADO PARA LO QUE SIGUE",
    introTitle: "Menos tiempo ajustando formatos. Más tiempo contando tu historia.",
    introBody: "Una experiencia de edición clara, pensada para que el contenido sea siempre lo más importante.",
    features: [
      { title: "Todo en su lugar", description: "Organiza tu experiencia, educación y habilidades desde un editor estructurado." },
      { title: "Mira cada cambio", description: "Visualiza cómo toma forma tu currículum mientras lo personalizas." },
      { title: "Listo para compartir", description: "Exporta tu documento en PDF con una presentación cuidada." },
    ],
    showcaseLabel: "EL EDITOR",
    showcaseTitle: "Un espacio para construir tu próxima oportunidad.",
    showcaseBody: "Sin herramientas complejas ni distracciones. Solo tu información, tus decisiones y una vista clara del resultado.",
    mockPersonal: "Información personal",
    mockProfile: "Perfil profesional",
    mockExperience: "Experiencia",
    mockEducation: "Educación",
    mockDesign: "Diseño",
    mockName: "Nombre",
    mockSurname: "Apellido",
    mockTitle: "Título profesional",
    mockPreview: "Vista previa",
    mockSaved: "Guardado",
    mockDocument: "Tu currículum",
    templateLabel: "PLANTILLAS",
    templateTitle: "Tu contenido. Tu estilo.",
    templateBody: "Elige la presentación que mejor acompañe tu trayectoria. Desde un diseño clásico hasta uno enfocado en la lectura automatizada.",
    classic: "Classic",
    classicDescription: "Una presentación equilibrada y elegante.",
    ats: "ATS",
    atsDescription: "Una estructura limpia y directa.",
    workflowLabel: "ASÍ DE SIMPLE",
    workflowTitle: "De tu experiencia a un gran currículum.",
    steps: [
      { number: "01", title: "Cuenta tu historia", description: "Añade los datos y logros que te representan." },
      { number: "02", title: "Dale tu estilo", description: "Organiza y personaliza la presentación." },
      { number: "03", title: "Llévalo contigo", description: "Descarga tu currículum en PDF." },
    ],
    closingLabel: "TU SIGUIENTE PASO EMPIEZA AQUÍ",
    closingTitle: "Lo que has logrado merece verse bien.",
    closingBody: "Prepara un currículum a la altura de tu experiencia.",
    closingCta: "Empezar ahora",
    footer: "Una forma más sencilla de presentar tu trayectoria.",
    rights: "CV Builder. Diseñado para avanzar.",
  },
  en: {
    navHow: "How it works",
    navTemplates: "Templates",
    navFeatures: "Benefits",
    open: "Open editor",
    eyebrow: "YOUR CAREER, BEAUTIFULLY PRESENTED",
    titleOne: "Your experience",
    titleTwo: "deserves to stand out.",
    intro: "Turn your career into a resume that speaks for you. Design, personalize, and export a professional document without the hassle.",
    start: "Build my resume",
    explore: "Explore the product",
    proofOne: "Intuitive editing",
    proofTwo: "Instant preview",
    proofThree: "PDF export",
    sample: "PREVIEW · SAMPLE",
    sampleRole: "Software engineer",
    sampleSummary: "PROFESSIONAL PROFILE",
    sampleText: "Specializing in digital product development, software architecture, and people-centered experiences.",
    sampleExperience: "EXPERIENCE",
    samplePosition: "Senior Software Engineer",
    sampleCompany: "Digital Studio · 2022 — Present",
    sampleEducation: "EDUCATION",
    sampleDegree: "Software Engineering",
    sampleSkills: "SKILLS",
    sampleSkillsValue: "TypeScript · React · Architecture · APIs",
    sampleContact: "Santo Domingo · hello@example.com",
    floating: "Every detail matters.",
    introLabel: "MADE FOR WHAT'S NEXT",
    introTitle: "Less time fixing layouts. More time telling your story.",
    introBody: "A clear editing experience designed to keep your content front and center.",
    features: [
      { title: "Everything in place", description: "Organize experience, education, and skills in a structured editor." },
      { title: "See every change", description: "Preview your resume as you make it your own." },
      { title: "Ready to share", description: "Export a thoughtfully presented PDF document." },
    ],
    showcaseLabel: "THE EDITOR",
    showcaseTitle: "A space to build your next opportunity.",
    showcaseBody: "No complicated tools or distractions. Just your information, your choices, and a clear view of the result.",
    mockPersonal: "Personal information",
    mockProfile: "Professional profile",
    mockExperience: "Experience",
    mockEducation: "Education",
    mockDesign: "Design",
    mockName: "First name",
    mockSurname: "Last name",
    mockTitle: "Professional title",
    mockPreview: "Preview",
    mockSaved: "Saved",
    mockDocument: "Your resume",
    templateLabel: "TEMPLATES",
    templateTitle: "Your content. Your style.",
    templateBody: "Choose the layout that fits your career. From a timeless classic to a layout focused on automated readability.",
    classic: "Classic",
    classicDescription: "A balanced, elegant presentation.",
    ats: "ATS",
    atsDescription: "A clean, straightforward structure.",
    workflowLabel: "THAT SIMPLE",
    workflowTitle: "From your experience to a great resume.",
    steps: [
      { number: "01", title: "Tell your story", description: "Add the details and achievements that represent you." },
      { number: "02", title: "Make it yours", description: "Organize and customize the presentation." },
      { number: "03", title: "Take it with you", description: "Download your resume as a PDF." },
    ],
    closingLabel: "YOUR NEXT STEP STARTS HERE",
    closingTitle: "What you've achieved deserves to look great.",
    closingBody: "Create a resume worthy of your experience.",
    closingCta: "Get started",
    footer: "A simpler way to present your career.",
    rights: "CV Builder. Made for moving forward.",
  },
} as const;

type LandingCopy = (typeof copy)[keyof typeof copy];

const container = "mx-auto w-full max-w-[1200px] px-5 sm:px-8 lg:px-10";
const sectionLabel = "text-[10px] font-extrabold uppercase tracking-[0.17em] text-[#2e6652]";
const heading = "text-[clamp(2rem,4vw,3.3rem)] font-semibold leading-[1.16] tracking-[-0.065em]";
const button = "inline-flex min-h-12 items-center justify-center gap-4 rounded-lg px-5 text-xs font-bold transition duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6eaa89] motion-reduce:transform-none";

function DocumentPreview({ t, compact = false, ats = false }: { t: LandingCopy; compact?: boolean; ats?: boolean }) {
  return (
    <div className={`aspect-[210/297] w-full overflow-hidden bg-white font-sans text-[#252a27] shadow-[0_12px_35px_#24342b20] ${compact ? "p-[8%]" : "p-[8.5%]"}`}>
      <div className={`mb-[9%] h-1 w-9 ${ats ? "bg-zinc-900" : "bg-[#356d55]"}`} />
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className={`${compact ? "text-[clamp(13px,2vw,21px)]" : "text-[clamp(18px,2.5vw,29px)]"} font-bold leading-tight tracking-[-0.055em]`}>Alex Morgan</p>
          <p className={`mt-1 text-zinc-500 ${compact ? "text-[7px]" : "text-[10px]"}`}>{t.sampleRole}</p>
        </div>
        {!ats && <div className={`grid shrink-0 place-items-center rounded-full bg-[#e5eee7] font-bold text-[#38654e] ${compact ? "size-7 text-[10px]" : "size-11 text-sm"}`}>AM</div>}
      </div>
      <p className={`mt-3 text-zinc-500 ${compact ? "text-[5px]" : "text-[7px]"}`}>{t.sampleContact}</p>
      <div className="my-4 h-px bg-[#d8dfd9]" />
      <div className={ats ? "space-y-4" : "grid grid-cols-[1.5fr_1fr] gap-4"}>
        <div className="space-y-5">
          <section>
            <h4 className={`${compact ? "text-[6px]" : "text-[8px]"} mb-2 font-extrabold tracking-[0.12em]`}>{t.sampleSummary}</h4>
            <p className={`${compact ? "text-[6px]" : "text-[8px]"} leading-[1.7] text-zinc-500`}>{t.sampleText}</p>
          </section>
          <section>
            <h4 className={`${compact ? "text-[6px]" : "text-[8px]"} mb-2 font-extrabold tracking-[0.12em]`}>{t.sampleExperience}</h4>
            <strong className={`${compact ? "text-[7px]" : "text-[9px]"} block`}>{t.samplePosition}</strong>
            <span className="mt-1 block text-[6px] text-zinc-400">{t.sampleCompany}</span>
            <p className={`${compact ? "text-[6px]" : "text-[8px]"} mt-2 leading-[1.7] text-zinc-500`}>{t.sampleText}</p>
          </section>
        </div>
        <div className={`${ats ? "border-t pt-3" : "border-l border-zinc-200 pl-3"} space-y-5`}>
          <section>
            <h4 className={`${compact ? "text-[6px]" : "text-[8px]"} mb-2 font-extrabold tracking-[0.12em]`}>{t.sampleEducation}</h4>
            <strong className={`${compact ? "text-[7px]" : "text-[9px]"} block`}>{t.sampleDegree}</strong>
            <span className="mt-1 block text-[6px] text-zinc-400">2017 — 2021</span>
          </section>
          <section>
            <h4 className={`${compact ? "text-[6px]" : "text-[8px]"} mb-2 font-extrabold tracking-[0.12em]`}>{t.sampleSkills}</h4>
            <p className={`${compact ? "text-[6px]" : "text-[8px]"} leading-relaxed text-zinc-500`}>{t.sampleSkillsValue}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function EditorMockup({ t }: { t: LandingCopy }) {
  const en = t === copy.en;
  const sections = [t.mockPersonal, t.mockProfile, t.mockExperience, t.mockEducation, en ? "Skills" : "Habilidades", en ? "Languages" : "Idiomas", en ? "Specialization" : "Especialización", en ? "Projects" : "Proyectos", t.mockDesign];
  const field = (label: string, value: string, wide = false) => (
    <div className={`min-w-0 ${wide ? "col-span-2" : ""}`} key={label}>
      <p className="mb-1.5 text-[10px] font-semibold">{label}</p>
      <div className="truncate rounded-md border border-zinc-200 bg-white px-3 py-2.5 text-[10px] text-zinc-600">{value}</div>
    </div>
  );
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-[0_30px_70px_#00000030]" aria-label={t.showcaseTitle}>
      <div className="flex h-16 items-center justify-between gap-3 border-b border-zinc-200 px-3 sm:px-5">
        <div className="min-w-0"><p className="text-sm font-semibold">CV Builder</p><p className="hidden text-[9px] text-zinc-400 sm:block">{en ? "Local editor with JSON files" : "Editor local con archivos JSON"}</p></div>
        <div className="flex items-center gap-2 text-[10px]">
          <span className="hidden items-center gap-2 rounded-md border border-zinc-200 px-2.5 py-2 lg:inline-flex">{en ? "EN · English" : "ES · Español"}<ChevronDown size={12} /></span>
          <span className="hidden items-center gap-1 text-emerald-700 sm:inline-flex"><CheckCircle2 size={13} />{t.mockSaved}</span>
          <span className="inline-flex items-center gap-1.5 rounded-md border border-zinc-200 px-2.5 py-2"><Eye size={13} />{t.mockPreview}</span>
          <span className="hidden items-center gap-1 rounded-md border border-zinc-200 px-2.5 py-2 text-zinc-400 md:inline-flex"><Save size={13} />{en ? "Save" : "Guardar"}</span>
          <MoreHorizontal className="hidden text-zinc-500 sm:block" size={16} />
        </div>
      </div>
      <div className="grid min-h-[490px] grid-cols-1 md:grid-cols-2 lg:grid-cols-[140px_minmax(0,1fr)_minmax(260px,44%)]">
        <aside className="hidden flex-col gap-1 border-r border-zinc-200 bg-zinc-50 p-3 lg:flex">
          {sections.map((section, index) => <span key={section} className={`rounded-md px-2.5 py-2.5 text-[10px] ${index === 0 ? "bg-white font-semibold text-zinc-950" : "text-zinc-600"}`}>{section}</span>)}
        </aside>
        <div className="min-w-0 bg-white p-4 sm:p-6">
          <h3 className="text-base font-semibold">{t.mockPersonal}</h3>
          <p className="mb-5 mt-1 text-[10px] text-zinc-400">{en ? "Details shown in the resume header and sidebar." : "Datos principales que aparecen en la cabecera y sidebar del CV."}</p>
          <div className="grid grid-cols-2 gap-3">
            {field(t.mockName, "Alex")}{field(t.mockSurname, "Morgan")}{field(t.mockTitle, t.sampleRole, true)}
            {field(en ? "Email" : "Correo electrónico", "alex@ejemplo.com")}{field(en ? "Phone" : "Teléfono", "+1 (809) 555-0100")}
          </div>
          <div className="mt-4 rounded-lg border border-zinc-200 p-3">
            <p className="text-[11px] font-semibold">{en ? "Photo" : "Foto"}</p>
            <p className="mt-1 text-[9px] text-zinc-400">{en ? "Stored locally in public/profile." : "Se guarda localmente dentro de public/profile."}</p>
            <div className="mt-3 flex items-center gap-3"><div className="grid h-16 w-14 place-items-center rounded-md bg-zinc-200 text-sm font-bold text-zinc-600">AM</div><span className="rounded-md border border-zinc-200 px-3 py-2 text-[9px]">{en ? "Upload photo" : "Subir foto"}</span></div>
          </div>
          <div className="mt-5 flex items-center justify-between"><strong className="text-xs">{en ? "Links" : "Enlaces"}</strong><span className="rounded-md border border-zinc-200 px-2.5 py-1.5 text-[9px]">+ {en ? "Add" : "Agregar"}</span></div>
          <div className="mt-2 flex min-w-0 justify-between gap-2 rounded-md border border-zinc-200 p-3 text-[10px]">GitHub <span className="truncate text-zinc-500">github.com/alexmorgan</span></div>
        </div>
        <aside className="hidden min-w-0 border-l border-zinc-200 bg-zinc-100 md:block">
          <div className="border-b border-zinc-200 bg-zinc-50 p-3 sm:p-4">
            <div className="flex justify-between gap-2 text-[11px]"><strong>{en ? "Page 1" : "Página 1"}</strong><b className="text-emerald-700">78% {en ? "used" : "ocupado"}</b></div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-zinc-200"><div className="h-full w-[78%] rounded-full bg-emerald-600" /></div>
            <p className="mt-2 text-[9px] text-zinc-500">{en ? "Your resume fits on one page." : "Tu currículum cabe en una página."}</p>
          </div>
          <div className="mx-auto max-w-[330px] p-5"><DocumentPreview t={t} compact /></div>
        </aside>
      </div>
      <p className="border-t border-zinc-200 bg-zinc-50 px-4 py-2 text-center text-[9px] text-zinc-400 md:hidden">{en ? "Illustrative editor preview" : "Vista ilustrativa del editor"}</p>
    </div>
  );
}

export default async function Home() {
  const data = await getCVData();
  const t = data.settings.locale === "en" ? copy.en : copy.es;
  return (
    <main className="overflow-x-clip bg-[#f8f9f6] font-[family-name:var(--font-montserrat)] text-[#191d1b]">
      <header className="relative z-10 border-b border-[#e5e8e2] bg-[#fbfcfa]">
        <div className={`${container} flex min-h-[76px] items-center justify-between gap-5`}>
          <Link href="/" className="inline-flex items-center gap-2.5 text-lg font-extrabold tracking-[-0.06em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"><span className="grid size-9 place-items-center rounded-xl bg-[#191d1b] text-white"><FileText size={18} /></span>CV<span className="-ml-2 font-medium">Builder</span></Link>
          <nav className="hidden items-center gap-9 text-xs font-semibold text-zinc-600 md:flex" aria-label={t.navHow}><a className="hover:text-[#2e6652]" href="#como-funciona">{t.navHow}</a><a className="hover:text-[#2e6652]" href="#plantillas">{t.navTemplates}</a><a className="hover:text-[#2e6652]" href="#ventajas">{t.navFeatures}</a></nav>
          <Link href="/editor" className="inline-flex items-center gap-2 rounded-lg border border-[#d7ddd5] px-3 py-2.5 text-xs font-bold transition hover:bg-[#e9eee8] sm:px-4">{t.open}<ArrowUpRight size={16} /></Link>
        </div>
      </header>
      <section className="relative border-b border-[#e5e8e2] bg-[radial-gradient(ellipse_at_80%_45%,#e7efe6_0%,#f8f9f6_55%)]" aria-labelledby="hero-title">
        <div className={`${container} grid items-center gap-8 py-16 md:grid-cols-2 md:gap-10 lg:min-h-[680px] lg:py-24`}>
          <div className="relative z-10">
            <p className="inline-flex items-center gap-3 text-[10px] font-extrabold tracking-[0.17em] text-[#2e6652]"><span className="size-2 rounded-full bg-[#5c9a7c] ring-[5px] ring-[#e5f0e8]" />{t.eyebrow}</p>
            <h1 id="hero-title" className="mt-7 max-w-[650px] text-[clamp(3rem,5.4vw,5rem)] font-bold leading-[1.1] tracking-[-0.075em]">{t.titleOne}<br /><em className="font-serif font-normal text-[#2e6652]">{t.titleTwo}</em></h1>
            <p className="mt-6 max-w-[475px] text-sm leading-8 text-[#6c746e] sm:text-base">{t.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5"><Link href="/editor" className={`${button} bg-[#191d1b] text-white shadow-xl shadow-[#19231b1c] hover:bg-[#345d4a]`}>{t.start}<ArrowUpRight size={18} /></Link><a href="#producto" className={`${button} px-0`}>{t.explore}<ArrowDownRight size={18} /></a></div>
            <div className="mt-10 flex flex-wrap gap-x-5 gap-y-3">{[t.proofOne, t.proofTwo, t.proofThree].map(item => <span key={item} className="inline-flex items-center gap-1.5 text-[10px] text-zinc-500"><Check size={14} className="text-[#2e6652]" />{item}</span>)}</div>
          </div>
          <div className="relative isolate flex min-h-[440px] items-center justify-center sm:min-h-[520px]">
            <div className="absolute -z-10 size-[320px] rounded-full bg-[#dce9dd]/70 sm:size-[450px]" /><div className="absolute -z-10 size-[230px] rounded-full border border-[#b9d3bf] sm:size-[310px]" />
            <div className="w-[270px] max-w-[80%] -rotate-[5deg] drop-shadow-[0_28px_32px_#203e2b30] transition-transform duration-700 hover:-rotate-2 sm:w-[350px]"><DocumentPreview t={t} /></div>
            <div className="absolute bottom-[70px] right-0 flex rotate-[4deg] items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-[10px] font-bold shadow-xl sm:right-3 sm:px-4"><span className="grid size-8 place-items-center rounded-lg bg-[#e7f0e8] text-[#2e6652]"><Sparkles size={16} /></span>{t.floating}</div>
            <span className="absolute bottom-3 left-3 text-[9px] font-bold tracking-[0.15em] text-[#7b897d]">{t.sample}</span>
          </div>
        </div>
      </section>
      <section id="ventajas" className="scroll-mt-16 py-20 lg:py-28"><div className={container}>
        <p className={sectionLabel}><span className="mr-2 text-zinc-400">01 /</span>{t.introLabel}</p>
        <div className="mb-12 mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className={`${heading} max-w-[750px]`}>{t.introTitle}</h2><p className="max-w-[320px] shrink-0 text-sm leading-7 text-[#6c746e]">{t.introBody}</p></div>
        <div className="grid overflow-hidden rounded-2xl border border-[#e5e8e2] bg-white md:grid-cols-3">{t.features.map((f, i) => { const Icon = [PenLine, MousePointer2, Download][i]; return <article key={f.title} className="border-b border-[#e5e8e2] p-8 last:border-0 md:border-b-0 md:border-r md:last:border-r-0"><div className="flex items-center justify-between text-[#2e6652]"><span className="text-[10px] text-zinc-400">0{i + 1}</span><Icon size={22} strokeWidth={1.5} /></div><h3 className="mt-12 text-lg font-bold tracking-tight">{f.title}</h3><p className="mt-3 max-w-[280px] text-xs leading-6 text-[#6c746e]">{f.description}</p></article> })}</div>
      </div></section>
      <section id="producto" className="scroll-mt-16 bg-[#1b2520] py-20 text-white lg:py-28"><div className={container}>
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className={`${sectionLabel} text-[#a9cdb7]`}><span className="mr-2 text-[#667e6d]">02 /</span>{t.showcaseLabel}</p><h2 className={`${heading} mt-6 max-w-[680px]`}>{t.showcaseTitle}</h2></div><p className="max-w-[310px] shrink-0 text-sm leading-7 text-[#aab9ae]">{t.showcaseBody}</p></div>
        <EditorMockup t={t} />
      </div></section>
      <section id="plantillas" className="scroll-mt-16 bg-white py-20 lg:py-28"><div className={container}>
        <p className={sectionLabel}><span className="mr-2 text-zinc-400">03 /</span>{t.templateLabel}</p>
        <div className="mb-12 mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end"><h2 className={heading}>{t.templateTitle}</h2><p className="max-w-[320px] text-sm leading-7 text-[#6c746e]">{t.templateBody}</p></div>
        <div className="grid gap-6 md:grid-cols-2">{[{ name: t.classic, description: t.classicDescription, ats: false, icon: LayoutTemplate, bg: "bg-[#e7eee7]" }, { name: t.ats, description: t.atsDescription, ats: true, icon: FileText, bg: "bg-[#edece8]" }].map(item => <article key={item.name} className="group overflow-hidden rounded-2xl border border-[#e4e8e2] bg-white"><div className={`flex h-[340px] justify-center overflow-hidden pt-10 sm:h-[425px] ${item.bg}`}><div className="w-[225px] transition-transform duration-500 group-hover:-translate-y-3 sm:w-[285px]"><DocumentPreview t={t} compact ats={item.ats} /></div></div><div className="flex items-center justify-between p-6"><div><h3 className="text-lg font-bold">{item.name}</h3><p className="mt-1 text-xs text-[#6c746e]">{item.description}</p></div><item.icon size={20} className="text-[#2e6652]" /></div></article>)}</div>
      </div></section>
      <section id="como-funciona" className="scroll-mt-16 border-t border-[#e5e8e2] py-20 lg:py-28"><div className={container}>
        <p className={sectionLabel}><span className="mr-2 text-zinc-400">04 /</span>{t.workflowLabel}</p><h2 className={`${heading} mb-14 mt-6 max-w-[750px]`}>{t.workflowTitle}</h2>
        <div className="grid gap-8 md:grid-cols-3">{t.steps.map((step, i) => <article key={step.number} className="border-t border-[#cbd4cc] pt-5"><div className="flex items-center justify-between text-[#2e6652]"><span className="text-sm font-bold">{step.number}</span>{i === 2 ? <CheckCircle2 size={21} /> : <ArrowRight size={21} />}</div><h3 className="mt-10 text-xl font-semibold tracking-tight">{step.title}</h3><p className="mt-2 max-w-[280px] text-xs leading-6 text-[#6c746e]">{step.description}</p></article>)}</div>
      </div></section>
      <section className="relative overflow-hidden bg-[#2b5a45] text-white"><div className={`${container} relative py-24 lg:py-28`}><p className={`${sectionLabel} text-[#a9cdb7]`}>{t.closingLabel}</p><h2 className="relative z-10 mt-6 max-w-[800px] text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.12] tracking-[-0.07em]">{t.closingTitle}</h2><p className="relative z-10 mt-5 text-sm text-[#d4e5d8]">{t.closingBody}</p><Link href="/editor" className={`${button} relative z-10 mt-8 bg-white text-[#244734] hover:bg-[#e9f3eb]`}>{t.closingCta}<ArrowUpRight size={19} /></Link><FileText size={190} strokeWidth={0.55} aria-hidden="true" className="pointer-events-none absolute right-0 top-16 -rotate-[18deg] opacity-15" /></div></section>
      <footer className="bg-[#fbfcfa]"><div className={`${container} flex flex-col justify-between gap-6 py-12 sm:flex-row sm:items-end`}><div><Link href="/" className="inline-flex items-center gap-2 font-extrabold tracking-tight"><span className="grid size-8 place-items-center rounded-lg bg-[#191d1b] text-white"><FileText size={17} /></span>CV Builder</Link><p className="mt-3 text-xs text-zinc-500">{t.footer}</p></div><p className="text-xs text-zinc-500">{t.rights}</p></div></footer>
    </main>
  );
}
