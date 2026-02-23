"use client"

import { Button } from "@/components/atoms/Button";
import { Input } from "@/components/atoms/Input";
import { useAuth } from "@/context/AuthContext";
import { Notify } from "@/lib/notify";
import { LoginService } from "@/services/login-service";
import { Utils } from "@/services/utils";
import { ExceptionDefault } from "@/types/default";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";

export type LoginForm = {
    email: string | undefined
    senha: string | undefined
}

export type LoginDto = {
    nome: string
    email: string
    token: string
}


export function ConteudoLogin(){
    const [loginForm, setLoginForm] = useState<LoginForm>({email: undefined, senha: undefined} as LoginForm);
    const { login } = useAuth();
    const route = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    async function logar(){
        if(!loginForm.senha || !loginForm.email){
            Notify.error("É necessário informar email e senha para logar");
            return;
        }

        try{
            setIsLoading(true);
            const resposta = await LoginService.login(loginForm);
            login({
                token: resposta.token,
                user: {
                    id: "",
                    nome: resposta.nome,
                    email: resposta.email
                }
            });

            Notify.success("Login realizado com sucesso!", {duration: 2000});
            setTimeout(() => {
                route.push("/campeonatos");
            }, 2000);
            
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar logar no sistema")
            }
        } finally{
            setIsLoading(false);
        }
    }   

    return (
        <div style={styles.container}>
            <div style={styles.containerContent}>
                <div style={styles.containerHeader}>
                    <span style={{color: "var(--color-bg-light)", fontWeight: "bold"}}>Login</span>
                </div>
                <div style={styles.containerMain}>
                    <div style={styles.containerInput}>
                        <h5>Email</h5>
                        <Input 
                            value={loginForm.email}
                            placeholder="email@cms.com"
                            onChange={valor => Utils.updateField(setLoginForm, "email", valor)}
                        />
                    </div>

                    <div style={styles.containerInput}>
                        <h5>Senha</h5>
                        <Input 
                            type="password"
                            value={loginForm.senha}
                            placeholder="minhasenha123"
                            onChange={valor => Utils.updateField(setLoginForm, "senha", valor)}
                        />
                    </div>
                </div>
                <div style={styles.containerFooter}>
                    <Button mensagem="Logar" isLoading={isLoading} act={logar} />
                </div>
            </div>
        </div>
        
    );
}


const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        width: "100%",
        // backgroundColor: "#f58585",
        marginTop: "50px"
    },
    containerContent: {
        display: "grid",
        gridTemplateRows: "1fr 4fr 1fr",
        backgroundColor: "var(--color-bg-light)",
        minHeight: "30vh",
        width: "50%",
        maxWidth: "450px",
        borderRadius: "20px"
    },
    containerHeader: {
        display: "flex",
        alignItems: "center",
        justifyContent: 'center',
        width: "100%",
        backgroundColor: "var(--color-primary)",
        borderRadius: "10px"
    },
    containerMain: {
        display: "flex",
        flexDirection: "column",
        gap: "30px",
        padding: "10px 10px"
    },
    containerInput: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "5px"
    },
    containerFooter: {
        display: "flex",
        flexDirection: "column",
        padding: "10px 10px"
    }
}