"use client";

import Image from "next/image";
import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useAuth } from "@/context/AuthContext";
import { Notify } from "@/lib/notify";
import { LoginService } from "@/services/login-service";
import { Utils } from "@/services/utils";
import { ExceptionDefault } from "@/types/default";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LoginForm } from "@/types/login";


export function ConteudoLogin() {
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: undefined,
    senha: undefined,
  });

  const { login } = useAuth();
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function logar() {
    if (!loginForm.senha || !loginForm.email) {
      Notify.error("É necessário informar email e senha");
      return;
    }

    try {
      setIsLoading(true);

      const resposta = await LoginService.login(loginForm);

      login({
        token: resposta.token,
        user: {
          id: "",
          nome: resposta.nome,
          email: resposta.email,
        },
      });

      Notify.success("Login realizado com sucesso!", { duration: 2000 });

      setTimeout(() => {
        route.push("/campeonatos");
      }, 2000);
    } catch (error: any) {
      if (error.response) {
        const exception = error.response.data as ExceptionDefault;
        Notify.error(exception.erros[0]);
      } else {
        Notify.error("Erro ao tentar logar");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* 🔸 HEADER COM IMAGEM */}
        <div style={styles.header}>
          <Image
            src="/imagem5.png"
            alt="CMS Login"
            width={150}
            height={150}
          />
          <h2 style={styles.title}>Acesse sua conta</h2>
          <p style={styles.subtitle}>
            Acesse sua conta para gerenciar os campeonatos de sua organização
          </p>
        </div>

        {/* 🔸 FORM */}
        <div style={styles.form}>
          <div style={styles.inputGroup}>
            <label>Email</label>
            <Input
              value={loginForm.email}
              placeholder="email@cms.com"
              onChange={(valor) =>
                Utils.updateField(setLoginForm, "email", valor)
              }
            />
          </div>

          <div style={styles.inputGroup}>
            <label>Senha</label>
            <Input
              type="password"
              value={loginForm.senha}
              placeholder="••••••••"
              onChange={(valor) =>
                Utils.updateField(setLoginForm, "senha", valor)
              }
            />
          </div>
        </div>

        {/* 🔸 ACTION */}
        <div style={styles.footer}>
          <Button
            mensagem="Entrar"
            isLoading={isLoading}
            act={logar}
            style={styles.button}
          />
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    minWidth: "500px",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f888",
    // backgroundColor: "var(--color-bg)",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "800px",
    backgroundColor: "var(--color-bg-light)",
    borderTopRightRadius: "10px",
    borderTopLeftRadius: "10px",
    // padding: "5px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    marginTop: "50px",
    paddingBottom: "5px"
  },

  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "var(--color-primary)",
    borderTopRightRadius: "10px",
    borderTopLeftRadius: "10px",
  },

  title: {
    fontSize: "22px",
    fontWeight: 700,
    color: "var(--color-bg-light)",
  },

  subtitle: {
    fontSize: "14px",
    color: "var(--color-bg-light)",
    textAlign: "center",
    marginBottom: "10px"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "30px",
    paddingBottom: "20px",
    padding: "0px 5px",
    marginBottom: "20px"
  },

  inputGroup: {
    display: "flex",
    width: "100%",
    flexDirection: "column",
    gap: "6px",
    fontSize: "14px",
    color: "var(--color-text)",
  },

  footer: {
    display: "flex",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    // gap: "10px",
    padding: "5px 20px",
  },

  button: {
    width: "100%",
    height: "42px",
    justifyContent: "center",
  },
};