import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { Cloud, X } from "lucide-react";
import { accountCache, accountConfigured, signOutAccount, supabase, syncLabels } from "../sync/account.js";

export default function AccountPanel({ close }) {
  const state = useSyncExternalStore(accountCache.subscribe, accountCache.getState);
  const dialog = useRef(null);
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const element = dialog.current;
    const opener = document.activeElement;
    element.showModal();
    return () => { element.close(); opener?.focus(); };
  }, []);
  async function run(action) {
    setBusy(true); setMessage(""); setFailed(false);
    try { await action(); }
    catch (error) {
      setFailed(true);
      const messages = {
        invalid_credentials: "邮箱或密码不正确，请重试。",
        email_not_confirmed: "请先打开邮箱中的确认邮件，然后回来登录。",
        email_address_not_authorized: "当前网站暂时无法向此邮箱发送确认邮件，请联系网站管理员开通邮件服务。",
        user_already_exists: "此邮箱已注册，请切换到登录。",
        over_email_send_rate_limit: "邮件发送次数较多，请稍后再试。",
        weak_password: "请使用至少 8 位密码，包含字母和数字。",
      };
      setMessage(messages[error.code] || "暂时无法完成，请检查网络后重试。学习记录仍然保留。");
    } finally { setPassword(""); setBusy(false); }
  }
  function dismiss() {
    if (busy) return;
    accountCache.emit({ recovery: false });
    close();
  }
  const redirectTo = new URL(import.meta.env.BASE_URL, window.location.origin).href;
  async function submit(event) {
    event.preventDefault();
    await run(async () => {
      if (state.recovery) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        accountCache.emit({ recovery: false });
        setMessage("密码已更新。");
      } else if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
        if (error) throw error;
        setMessage("如果邮箱已注册，重设密码的邮件会发送到该邮箱。请在这个浏览器打开链接。");
      } else {
        const { data, error } = mode === "register"
          ? await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: redirectTo } })
          : await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
        if (!data.session) setMessage("请在这个浏览器打开邮箱中的确认链接，然后回来登录。");
        else { accountCache.setUser(data.user); await accountCache.sync(); }
      }
    });
  }
  return <dialog className="account-dialog" ref={dialog} aria-labelledby="account-title" onCancel={(event) => { event.preventDefault(); dismiss(); }}>
    <div className="account-heading"><Cloud size={22} /><h2 id="account-title">账户与同步</h2><button className="icon-button" aria-label="关闭账户窗口" disabled={busy} onClick={dismiss}><X size={20} /></button></div>
    <p>家长登录同一账户，就能在不同浏览器继续孩子的学习。</p>
    {!accountConfigured ? <div className="account-note"><strong>账户同步尚未启用</strong><p>当前学习记录保存在本浏览器。网站启用账户服务后，这里就可以登录和同步已有记录。</p></div> : state.recovery ? <form onSubmit={submit}>
      <label>新密码<input type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
      <button className="primary" disabled={busy}>保存新密码</button>
    </form> : state.user ? <>
      <div className="account-note"><strong>{state.user.email}</strong><p role="status">{syncLabels[state.status]}</p>{state.lastSynced && <p className="tiny">最近同步：{new Date(state.lastSynced).toLocaleString("zh-CN")}</p>}{state.pending > 0 && <p className="tiny">{state.pending} 项记录等待上传</p>}</div>
      <div className="account-actions"><button className="primary" disabled={busy} onClick={() => run(() => accountCache.sync())}>立即同步</button><button className="quiet-button" disabled={busy} onClick={() => run(async () => { accountCache.importGuest(); await accountCache.sync(); setMessage("已请求导入本浏览器原有记录；每个账户只导入一次，联网后完成。"); })}>导入本浏览器原有记录</button></div>
      <p className="tiny">首次登录后，可将登录前的记录导入此账户。退出后恢复本浏览器原有记录；账户缓存和待上传记录保留，重新登录后继续同步。</p>
      {state.conflicts.length > 0 && <details className="draft-conflicts"><summary>保留的草稿副本（{state.conflicts.length}）</summary><p>多个浏览器同时修改同一篇草稿时，会保留另一份内容，可复制后继续编辑。</p>{state.conflicts.map((item) => <label key={item.id}>{item.task}<textarea readOnly aria-label={`草稿副本 ${item.task}`} value={item.text} /></label>)}</details>}
      <button className="quiet-button" disabled={busy} onClick={() => run(signOutAccount)}>退出账户</button>
    </> : <>
      <div className="account-tabs"><button type="button" className={mode === "login" ? "active" : ""} disabled={busy} onClick={() => { setMode("login"); setMessage(""); }}>登录</button><button type="button" className={mode === "register" ? "active" : ""} disabled={busy} onClick={() => { setMode("register"); setMessage(""); }}>注册</button></div>
      <form onSubmit={submit}>
        <label>家长邮箱<input type="email" autoComplete="email" required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        {mode !== "reset" && <label>密码<input type="password" autoComplete={mode === "register" ? "new-password" : "current-password"} required minLength={mode === "register" ? 8 : 1} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
        <button className="primary" disabled={busy}>{busy ? "请稍候…" : mode === "register" ? "创建账户" : mode === "reset" ? "发送重设密码邮件" : "登录并同步"}</button>
      </form>
      <button className="quiet-button" disabled={busy} onClick={() => { setMode("reset"); setMessage(""); }}>忘记密码</button>
      <p className="tiny">学习记录、写作草稿、课程断点和发音偏好会同步到此账户。录音保留在当前页面，不上传。</p>
    </>}
    {message && <p className={failed ? "account-error" : "positive"} role={failed ? "alert" : "status"}>{message}</p>}
  </dialog>;
}
