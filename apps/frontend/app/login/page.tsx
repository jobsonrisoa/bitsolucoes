"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { fetchApi } from "@/lib/api/client";
import { useTransition } from "@/components/TransitionProvider";
import { Fan } from "@/components/svg/Fan";
import { Mark } from "@/components/svg/Mark";

export default function Login() {
  const { login } = useAuth();
  const { navigate } = useTransition();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await fetchApi("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const user = await fetchApi("/auth/me");
      login(user);
      const nextPath = new URLSearchParams(window.location.search).get("next");
      navigate(nextPath || "/painel");
    } catch {
      setError("Usuário ou senha inválidos.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-[1.2fr_1fr]">
      <section>
        <div className="mb-6 flex items-center gap-3">
          <Mark className="h-12 w-12 text-red" />
          <span className="font-archivo text-2xl">Átrio</span>
        </div>
        <h1 className="max-w-3xl font-archivo text-4xl leading-none md:text-6xl">
          Nenhuma demanda interna se perde.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted">
          Registre, acompanhe e conclua solicitações num só lugar, com rastreabilidade e uma linguagem visual própria.
        </p>
        <Fan className="mt-8 h-auto w-full max-w-xl text-blue" />
      </section>

      <section className="border-2 border-ink bg-paper p-8 shadow-lg">
        <h2 className="mb-6 font-archivo text-3xl">Entrar</h2>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="font-bold">Usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              className="border-2 border-ink p-2"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-bold">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="border-2 border-ink p-2"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm font-bold text-red-700">{error}</p> : null}
          <button
            type="submit"
            className="mt-4 border-2 border-ink bg-red p-3 font-archivo text-sm text-white shadow-sm active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
          <p className="mt-2 font-ibm text-xs text-muted">Demonstração: ana e demo123</p>
        </form>
      </section>
    </div>
  );
}
