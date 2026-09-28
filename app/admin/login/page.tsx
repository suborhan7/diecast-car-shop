"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function Login() {
  const [state, action, pending] = useActionState(login, null);
  return (
    <div className="container page narrow">
      <form action={action} className="panel admin-login">
        <h1>Shop owner login</h1>
        <label className="field">
          <span>Password</span>
          <input name="password" type="password" required autoFocus autoComplete="current-password" />
        </label>
        <button className="btn btn-primary btn-lg" disabled={pending}>
          {pending ? "Checking…" : "Log in"}
        </button>
        {state?.error && <p className="error">{state.error}</p>}
      </form>
    </div>
  );
}
