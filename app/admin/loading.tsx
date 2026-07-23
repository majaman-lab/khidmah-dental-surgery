export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-white/90 backdrop-blur-xl">
        <div className="section-shell flex h-20 items-center justify-between gap-4">
          <div>
            <div className="h-3 w-36 rounded bg-muted" />
            <div className="mt-3 h-5 w-56 rounded bg-muted" />
          </div>
          <div className="h-11 w-24 rounded-md bg-muted" />
        </div>
      </header>
      <div className="section-shell grid gap-6 py-8 lg:grid-cols-[16rem_1fr]">
        <aside className="hidden rounded-lg border border-border bg-white p-3 shadow-sm lg:block">
          <div className="grid gap-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="h-10 rounded-md bg-muted" />
            ))}
          </div>
        </aside>
        <section className="grid gap-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 rounded-lg border border-border bg-white p-5 shadow-sm">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="mt-4 h-8 w-16 rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="h-96 rounded-lg border border-border bg-white p-6 shadow-soft">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="mt-6 grid gap-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-12 rounded bg-muted" />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
