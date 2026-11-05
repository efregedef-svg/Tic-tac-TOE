export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.2),transparent_60%)]" />
      <div className="absolute -left-40 -top-24 h-[30rem] w-[30rem] animate-blob rounded-full bg-violet-600/30 blur-[120px]" />
      <div className="absolute -right-32 top-1/4 h-[26rem] w-[26rem] animate-blob rounded-full bg-sky-500/20 blur-[120px] [animation-delay:-6s]" />
      <div className="absolute -bottom-40 left-1/4 h-[30rem] w-[30rem] animate-blob rounded-full bg-fuchsia-600/20 blur-[130px] [animation-delay:-12s]" />
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
    </div>
  );
}
