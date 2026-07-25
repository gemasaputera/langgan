export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-600 text-xs font-bold text-white">
              L
            </div>
            <span className="font-bold text-white">Langgan</span>
          </div>
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} Langgan. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
