"use client";

import { Spinner } from "@/components/atoms/Spinner";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "@/components/Table";
import { Notify } from "@/lib/notify";
import { FaseService } from "@/services/fase-service";
import { RankingService } from "@/services/Ranking";
import { ExceptionDefault } from "@/types/default";
import { RankingFaseDto } from "@/types/fase";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ConteudoCompartilhamento() {
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    const [rankingDaFase, setRankingDaFase] = useState<RankingFaseDto[]>([]);
    const token = searchParams.get("token");
    const isFirstRun = useRef(true);

    async function carregaDados(){
        if(!token){
            Notify.error("O token é obrigatório para visualizar o ranking da competição")
            return;
        }

        const isFirst = isFirstRun.current;

        try{
            if (isFirst){
                setLoading(true);
            }
            const resultado = await RankingService.buscaRankingFase(token);
             if (isFirst){
                Notify.success("Ranking buscado com sucesso.");
            }
            setRankingDaFase(resultado);

        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar habilitar compartilhamento.")
            }
        } finally {
            if (isFirst) {
                setLoading(false);
                isFirstRun.current = false;
            }
        }
    }

    useEffect(() => {
        carregaDados();
        // 🔹 polling a cada 5 segundos
        const interval = setInterval(() => {
            carregaDados();
        }, 10000);

        // 🔹 cleanup (MUITO IMPORTANTE)
        return () => clearInterval(interval);
    }, [token]);

    return (
        <div style={{width: "80%", backgroundColor: "var(--color-bg-light)", padding: "10px"}}>
            <div style={styles.top}>
                <h1>Ranking</h1>
                <h3>{rankingDaFase && rankingDaFase.length > 0 && `Categoria: ${rankingDaFase[0].categoria}`}</h3>
                <h3>{rankingDaFase && rankingDaFase.length > 0 && `Fase: ${rankingDaFase[0].fase}`}</h3>
            </div>
            {rankingDaFase && rankingDaFase.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="1fr 2fr 1fr 1fr 1fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                        <div><strong>Posição</strong></div>
                        <div><strong>Competidor</strong></div>
                        <div><strong>Situação</strong></div>
                        <div><strong>Rodadas Disputadas</strong></div>
                        <div><strong>Nota Individual Total</strong></div>
                        <div><strong>Nota Por Dupla Total</strong></div>
                        <div><strong>Somatório Total</strong></div>
                        {/* <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div> */}
                    </DataTableHeader>
        
                    <DataTableBody maxHeight="800px">
                        {rankingDaFase.map((pontuacao) => (
                            <DataRow key={pontuacao.atletaId} columns="1fr 2fr 1fr 1fr 1fr 1fr 1fr" style={{backgroundColor: (pontuacao.situacao === "CANCELADO" ? "var(--color-error-opc)" : "var(--color-bg)")}}>
                                <DataCell>{pontuacao.posicao}°</DataCell>
                                <DataCell>{pontuacao.competidor}({pontuacao.numeroCompetidor})</DataCell>
                                <DataCell>{pontuacao.situacao}</DataCell>
                                <DataCell>{pontuacao.partidasConcluidas} de {pontuacao.partidas}</DataCell>
                                <DataCell>{pontuacao.notaIndividual}</DataCell>
                                <DataCell>{pontuacao.notaDupla}</DataCell>
                                <DataCell>{pontuacao.total}</DataCell>
                            </DataRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            ) : (
                <DataTableMessageEmpty>
                    {rankingDaFase && rankingDaFase.length == 0 && !loading ? (
                        <span>Ranking não encontrado</span>
                    ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>

                    )}
                </DataTableMessageEmpty>
            )}                
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    top: {
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        padding: "10px 0px"
    },
    footer: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        padding: "10px 0px"
  }
};