
function GateOrnament() {
  return (
    <svg
      viewBox="0 0 160 240"
      className="h-52 w-36 max-w-[70%] opacity-80"
      fill="none"
      stroke="#c9aa70"
      strokeWidth="1.2"
      aria-hidden="true"
    >
      <path d="M80 8 C35 8 20 45 20 90v115h120V90C140 45 125 8 80 8Z" />
      <path d="M80 23 C45 23 33 52 33 91v102h94V91c0-39-12-68-47-68Z" />
      <path d="M80 39v153M45 192V98c0-25 10-43 35-43s35 18 35 43v94" />
      <path d="m80 64 18 27-18 27-18-27z" />
      <path d="m80 75 9 16-9 16-9-16z" />
      <circle cx="80" cy="91" r="4" />
      <path d="M55 145c-12-9-15-22-9-34 9 8 13 17 9 34Z" />
      <path d="M105 145c12-9 15-22 9-34-9 8-13 17-9 34Z" />
      <path d="M80 137c-12 13-12 26 0 37 12-11 12-24 0-37Z" />
      <path d="M32 208h96M44 218h72M61 228h38" />
      <circle cx="20" cy="28" r="4" />
      <circle cx="140" cy="28" r="4" />
      <path d="m20 28-8 8 8 8 8-8zM140 28l-8 8 8 8 8-8z" />
    </svg>
  );
}

export default function Template({ children }) {
  const panelStyle = {
    background:
      "radial-gradient(ellipse at center, #292033 0%, #17121e 55%, #09080d 100%)",
    border: "1px solid #b99a62",
    boxShadow: "inset 0 0 35px #000000aa",
  };

  return (
    <div className="relative min-h-screen">
      <div
        className="archive-gate is-opening"
        aria-hidden="true"
        style={{ "--duration-page": "900ms" }}
      >
        <div
          className="archive-gate__panel archive-gate__panel--left relative flex items-center justify-center overflow-hidden"
          style={panelStyle}
        >
          <div className="absolute inset-3 border border-[#b99a62]/40" />
          <div className="absolute inset-5 border border-[#b99a62]/20" />
          <GateOrnament />
          <div className="absolute bottom-10 font-gothic text-xs tracking-[0.3em] text-[#c9aa70]">
            THE ARCHIVE
          </div>
        </div>

        <div
          className="archive-gate__panel archive-gate__panel--right relative flex items-center justify-center overflow-hidden"
          style={panelStyle}
        >
          <div className="absolute inset-3 border border-[#b99a62]/40" />
          <div className="absolute inset-5 border border-[#b99a62]/20" />
          <GateOrnament />
          <div className="absolute bottom-10 font-gothic text-xs tracking-[0.3em] text-[#c9aa70]">
            EST. 2026
          </div>
        </div>
      </div>

      <div className="relative">
        {children}
      </div>
    </div>
  );
}
