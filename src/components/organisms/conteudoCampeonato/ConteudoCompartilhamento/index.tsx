"use client";

import { Button } from "@/components/atoms/Button";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";
import { Spinner } from "@/components/atoms/Spinner";
import { SwitchInput } from "@/components/atoms/SwitchInput";
import { Notify } from "@/lib/notify";
import { CampeonatoService } from "@/services/campeonato-service";
import { CompartilhamentoDto } from "@/types/campeonato";
import { ExceptionDefault } from "@/types/default";
import { Copy } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ConteudoCompartilhamentoProps = {
    campeonatoId: string
}

export type SelectOption = {
  id: string;
  label: string;
};

export function ConteudoCompartilhamento({ campeonatoId }: ConteudoCompartilhamentoProps){
    const [loading, setLoading] = useState(true);
    // const [compartilhamentoDto, setCompartilhamentoDto] = useState<CompartilhamentoDto>({isHabilitado: true, token: "yjYMWnQupA6PFtdspzDRRg20VvOW1TsX5RltyRsZDzxKwfL_vi8wKBR_hJCzT0njLPF8rJ6Qb5hoD4PoxdchYOIjyMXT4AYX9JoKmdcdONnNc4Tich1RNPtDmZQvjYOmdiY9j7yGsmJAO_8q7g"});
    const [compartilhamentoDto, setCompartilhamentoDto] = useState<CompartilhamentoDto>();
    const [loadingCriacaoCompartilhamento, setLoadingCriacaoCompartilhamento] = useState(false);
    const [isLoadingHabilitarEDesabilitarCompartilhamento, setIsLoadingHabilitarEDesabilitarCompartilhamento] = useState(false);
    
    async function carregaDados(){
        try{
            setLoading(true);
            const resultado = await CampeonatoService.buscarCompartilhamentoCampeonatos(campeonatoId);
            setCompartilhamentoDto(resultado);
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar buscar compartilhamento.")
            }
        } finally {
            setLoading(false);
        }
    }

    function geraLinkCompartilhamento(token: string) : string {
        if (typeof window === "undefined") return "";

        const origin = window.location.origin;

        return `${origin}/ranking/compartilhamento?token=${token}`;
    }

    async function copiarLink() {
        try {

            if(!compartilhamentoDto){
                return;
            }

            const link = geraLinkCompartilhamento(compartilhamentoDto.token);

            await navigator.clipboard.writeText(link);

            Notify.success("Link copiado!");
        } catch (err) {
            Notify.error("Erro ao copiar link");
        }
    }

    async function criarCompartilhamento() {
        try{
            setLoadingCriacaoCompartilhamento(true);
            const resultado = await CampeonatoService.criarCompartilhamento(campeonatoId);
            Notify.success("Compartilhamento criado com sucesso.");
            setCompartilhamentoDto(resultado);

        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar criar compartilhamento.")
            }
        } finally {
            setLoadingCriacaoCompartilhamento(false);
        }
    }

    async function desabilitarCompartilhamento() {
        try{
            setIsLoadingHabilitarEDesabilitarCompartilhamento(true);
            const resultado = await CampeonatoService.desabilitarCompartilhamento(campeonatoId);
            Notify.success("Compartilhamento desabilitado com sucesso.");
            setCompartilhamentoDto(resultado);

        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar desabilitar compartilhamento.")
            }
        } finally {
            setIsLoadingHabilitarEDesabilitarCompartilhamento(false);
        }
    }

    async function habilitarCompartilhamento() {
        try{
            setIsLoadingHabilitarEDesabilitarCompartilhamento(true);
            const resultado = await CampeonatoService.habilitarCompartilhamento(campeonatoId);
            Notify.success("Compartilhamento habilitado com sucesso.");
            setCompartilhamentoDto(resultado);

        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar habilitar compartilhamento.")
            }
        } finally {
            setIsLoadingHabilitarEDesabilitarCompartilhamento(false);
        }
    }
    
    useEffect(() => {
        carregaDados();
    }, []);

    return (
        <div style={styles.container}>
            {loading ? (
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                    <span style={{color: "var(--color-confirm)", fontWeight: "bold", marginLeft: "10px"}}>Carregando</span>
                </div>
            ) : (
                <div style={styles.content}>
                    <h2 style={styles.title}>Compartilhamento</h2>
                    {compartilhamentoDto ? (
                        <div style={styles.containerContent}>
                            <div style={styles.cardLink}>
                                <div style={styles.containerPositionIcon}>
                                    <span style={styles.subTitle}>Link para compartilhamento</span>
                                    <ButtonIcon type="COPY" act={() => copiarLink()}/>
                                </div>
                                <h5 style={styles.linkText}>{geraLinkCompartilhamento(compartilhamentoDto.token)}</h5>
                            </div>
                            <div>
                                <SwitchInput
                                    value={compartilhamentoDto.isHabilitado}
                                    disabled={isLoadingHabilitarEDesabilitarCompartilhamento}
                                    onChange={async (valor) => {
                                        if(valor){
                                            await habilitarCompartilhamento()
                                        }else{
                                            await desabilitarCompartilhamento()
                                        }
                                    }}
                                    labelOn={isLoadingHabilitarEDesabilitarCompartilhamento ? "Carregando" : "Compartilhamento Ativo"}
                                    labelOff={isLoadingHabilitarEDesabilitarCompartilhamento ? "Carregando" : "Não Compartilhado"}
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={styles.containerNotResult}>
                            <Image
                                src="/imagem6.png"
                                alt="Sem resultados"
                                width={300}
                                height={300}
                                style={styles.image}
                                priority
                            />
                            <span style={styles.messageNotResult}>Nenhum compartilhamento encontrado.</span>
                            <Button mensagem="Criar compartilhamento" isLoading={loadingCriacaoCompartilhamento} act={() => criarCompartilhamento()} style={{marginTop: "30px"}}/>
                        </div>
                    )}
                </div>
            )}
        </div> 
    );
}


const styles: Record<string, React.CSSProperties> = {
    container: {
        display: "flex",
        justifyContent: "center",
        padding: "20px"
    },
    title: {
        color: "var(--color-primary)",
        marginBottom: "20px"
    },
    subTitle: {
        color: "var(--color-confirm)",
        fontSize: "16px"
    },
    content: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
    },
    containerContent: {
        // border: "1px solid #ccc",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        borderRadius: "10px",
        // boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        // padding: "10px"
    },
    cardLink: {
        width: "100%",
        backgroundColor: "var(--color-bg)",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "40vw"
    },
    containerPositionIcon: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    linkText: {
        wordBreak: "break-all",
        overflowWrap: "break-word",
        whiteSpace: "normal",
        marginTop: "8px",
        fontSize: "13px",
        color: "#374151",
        background: "#fff",
        padding: "8px",
        borderRadius: "6px",
        border: "1px solid #e5e7eb"
    },
    containerNotResult: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        marginTop: "20px"
    },
    messageNotResult: {
        color: "var(--color-confirm)"
    },
    containerMessage: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    }
};
