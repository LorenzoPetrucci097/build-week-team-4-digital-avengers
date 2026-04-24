// Auth — username = first name (lowercase), password = last name (lowercase).
// State is in-memory per session, re-login required on refresh (no password storage).

const AuthContext = React.createContext(null);

// Build the credential table from MEMBERS.
// "Christian Koscielniak Pinto" → username `christian`, password `pinto` (last token).
function buildUsers() {
  return MEMBERS.map((m) => {
    const tokens = m.name.split(/\s+/);
    const first  = tokens[0];
    const last   = tokens[tokens.length - 1];
    return {
      id: m.id,
      username: first.toLowerCase(),
      password: last.toLowerCase(),
      displayName: `${first} ${last[0]}.`,
      fullName: m.name,
      role: m.role.split("·")[0].trim(),
      initials: m.initials,
    };
  });
}

function AuthProvider({ children }) {
  const USERS = React.useMemo(buildUsers, []);
  const [user, setUser]         = React.useState(null);
  const [loginOpen, setLoginOpen] = React.useState(false);

  const login = (username, password) => {
    const u = USERS.find(
      (x) =>
        x.username === String(username).trim().toLowerCase() &&
        x.password === String(password).trim().toLowerCase()
    );
    if (!u) return { ok: false, error: "Credenziali non valide." };
    setUser(u);
    return { ok: true, user: u };
  };
  const logout = () => setUser(null);

  const value = { user, login, logout, USERS, loginOpen, setLoginOpen };
  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal />
    </AuthContext.Provider>
  );
}

function useAuth() {
  const v = React.useContext(AuthContext);
  if (!v) throw new Error("useAuth must be used inside <AuthProvider>");
  return v;
}

function LoginModal() {
  const { login, loginOpen, setLoginOpen } = useAuth();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError]       = React.useState("");
  const [showPw, setShowPw]     = React.useState(false);
  const userRef = React.useRef(null);

  React.useEffect(() => {
    if (loginOpen) {
      setUsername(""); setPassword(""); setError("");
      setTimeout(() => userRef.current?.focus(), 10);
    }
  }, [loginOpen]);

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLoginOpen(false); };
    if (loginOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loginOpen, setLoginOpen]);

  if (!loginOpen) return null;

  const submit = (e) => {
    e.preventDefault();
    const res = login(username, password);
    if (res.ok) setLoginOpen(false);
    else setError(res.error);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div
        className="pointer-events-none absolute inset-0 da-grid-bg opacity-40"
        aria-hidden="true"
      />
      <div
        onClick={() => setLoginOpen(false)}
        className="absolute inset-0"
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-lg border border-slate-800 bg-slate-950 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)]">
        {/* Header — terminal-style */}
        <div className="flex h-10 items-center gap-2 border-b border-slate-800 bg-slate-900/80 px-3">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">
            <span className="text-emerald-400">auth</span>
            <span className="text-slate-600">@</span>
            <span className="text-sky-400">digital-avengers</span>
            <span className="text-slate-600"> ~ </span>
            <span className="text-slate-500">login</span>
          </span>
          <button
            onClick={() => setLoginOpen(false)}
            className="ml-auto rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-200"
            title="close"
          >
            <Icon name="X" size={13} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 pt-5">
          <div className="mb-4">
            <div className="font-mono text-[11px] text-emerald-400">&gt; request_access --node ops-hub</div>
            <h2 className="mt-1 text-[18px] font-semibold tracking-tight text-slate-100">Operator login</h2>
            <p className="mt-1 font-mono text-[11px] text-slate-500">
              user · <span className="text-slate-400">first name</span>
              <span className="mx-1.5 text-slate-700">|</span>
              pass · <span className="text-slate-400">last name</span>
            </p>
          </div>

          <form onSubmit={submit} className="space-y-3">
            <label className="block">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">username</div>
              <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-2.5 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30">
                <Icon name="User" size={13} className="text-slate-500" />
                <input
                  ref={userRef}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoCapitalize="off"
                  autoComplete="username"
                  spellCheck={false}
                  className="w-full border-0 bg-transparent py-2 font-mono text-[13px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-0"
                  placeholder="lorenzo"
                />
              </div>
            </label>

            <label className="block">
              <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-slate-500">password</div>
              <div className="flex items-center gap-2 rounded-md border border-slate-800 bg-slate-900 px-2.5 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30">
                <Icon name="Lock" size={13} className="text-slate-500" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoCapitalize="off"
                  autoComplete="current-password"
                  spellCheck={false}
                  className="w-full border-0 bg-transparent py-2 font-mono text-[13px] text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-0"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  className="text-slate-500 hover:text-slate-300"
                  title={showPw ? "hide" : "show"}
                  tabIndex={-1}
                >
                  <Icon name={showPw ? "EyeOff" : "Eye"} size={13} />
                </button>
              </div>
            </label>

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1.5 font-mono text-[11px] text-red-300">
                <Icon name="AlertTriangle" size={12} />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-md bg-emerald-500 py-2 font-mono text-[12px] font-semibold uppercase tracking-widest text-slate-950 transition-colors hover:bg-emerald-400"
            >
              <Icon name="LogIn" size={13} />
              sign in
            </button>
          </form>

          <div className="mt-4 border-t border-slate-800 pt-3">
            <div className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">authorized operators</div>
            <div className="flex flex-wrap gap-1">
              {MEMBERS.map((m) => {
                const first = m.name.split(/\s+/)[0].toLowerCase();
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => { setUsername(first); userRef.current?.focus(); }}
                    className="inline-flex items-center gap-1 rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 font-mono text-[10px] text-slate-400 hover:border-emerald-500/40 hover:text-emerald-300"
                    title="click to prefill username"
                  >
                    <Avatar initials={m.initials} size={14} />
                    {first}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.AuthContext  = AuthContext;
window.AuthProvider = AuthProvider;
window.useAuth      = useAuth;
window.LoginModal   = LoginModal;
