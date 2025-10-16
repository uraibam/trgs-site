export default function FooterUtility() {
  const year = new Date().getFullYear();
  const links = [
    { name: 'Terms', href: '#' },          // TODO: replace with /terms when ready
    { name: 'Privacy', href: '#' },        // TODO: replace with /privacy
    { name: 'Cookie Policy', href: '#' }   // TODO: replace with /cookies
  ];

  return (
    <footer className="bg-[var(--bg)] text-[var(--text)]">
      <div className="mx-auto max-w-5xl px-6 py-6 border-t border-white/10">
        <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
          <nav aria-label="Utility links" className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {links.map((l) => (
              <a
                key={l.name}
                href={l.href}
                className="text-white/80 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded-sm"
              >
                {l.name}
              </a>
            ))}
          </nav>
          <p className="text-sm text-white/60">© {year} TRGS</p>
        </div>
      </div>
    </footer>
  );
}
