export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-6 text-center text-xs text-zinc-400">
        &copy; {new Date().getFullYear()} WorkFlow Note AI. All rights reserved.
      </div>
    </footer>
  )
}
