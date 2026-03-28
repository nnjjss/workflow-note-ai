export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white py-6">
      <div className="mx-auto max-w-5xl px-4 text-center text-sm text-zinc-500">
        &copy; {new Date().getFullYear()} WorkFlow Note AI. All rights reserved.
      </div>
    </footer>
  )
}
