'use client'

export function AdminKeyForm() {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const key = (e.target as HTMLFormElement).key.value
        document.cookie = `admin_key=${key}; path=/admin; SameSite=Strict`
        window.location.reload()
      }}
    >
      <input
        id="admin-key-input"
        name="key"
        type="password"
        placeholder="Admin Secret Key"
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
      />
      <button
        id="admin-key-submit"
        type="submit"
        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-2.5 rounded-xl text-sm transition"
      >
        Ingia
      </button>
    </form>
  )
}
