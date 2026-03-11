"use client";

import { useEffect, useState } from "react";
import { Modal } from "../../../modecules/ModalBase";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "../../../Table";
import { useRouter } from "next/navigation";
import { RankingFaseDto } from "@/types/fase";
import { FaseService } from "@/services/fase-service";
import { Spinner } from "@/components/atoms/Spinner";
import { Button } from "@/components/atoms/Button";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";
import { RelatorioService } from "@/services/relatorios-service";
import { Notify } from "@/lib/notify";
import { ExceptionDefault } from "@/types/default";
import { CategoriaService } from "@/services/categoria-service";
import { RankingGeralCategoriaDto } from "@/types/categoria";
import { getDescricaoSituacaoAtletaEnum } from "@/types/atleta";

type ConteudoCompetidoresProps = {
    categoriaId: string
    campeonatoId: string
}


export function CardRankingCategoria({ categoriaId, campeonatoId }: ConteudoCompetidoresProps){
    const [loading, setLoading] = useState(true);
    const [rankingDaCategoria, setRankingDaCategoria] = useState<RankingGeralCategoriaDto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isLoadingDownloadRanking, setIsLoadingDownloadRanking] = useState<boolean>(false);


    async function carregaDados(){
        try{
            setLoading(true)
            const resultado = await CategoriaService.buscaRankingGeralCategoria(categoriaId);
            setRankingDaCategoria(resultado);
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar buscar ranking geral da categoria.")
            }
        } finally {
            setLoading(false)
        }
    }

    async function downloadRankingEmPDF() {
        try{
            setIsLoadingDownloadRanking(true);
            await RelatorioService.downloadRankingGeralCategoria(categoriaId);
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar fazer o download do ranking.")
            }
        }finally {
            setIsLoadingDownloadRanking(false)
        }
        
    }

    useEffect(() => {
        carregaDados();
    }, []);

    return (
        <div>
            <div style={styles.top}>
                
                <h1>Pontuação parcial - Ranking</h1>
                {isLoadingDownloadRanking ? (
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                        <Spinner style={{width: "20px", height: "20px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </div>
                ) : (
                    <>
                        {isLoadingDownloadRanking ? (
                            <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "10px"}}>
                                <Spinner style={{width: "20px", height: "20px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                                <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                            </div>
                        ) : (
                            <>
                                {rankingDaCategoria && rankingDaCategoria.length > 0 && (
                                    <ButtonIcon 
                                        type="DOWNLOAD" 
                                        mensagem="Download" 
                                        isLoading={isLoadingDownloadRanking}
                                        act={() => downloadRankingEmPDF()}
                                    />)
                                }
                            </>
                        )}
                    </>
                )}
                
            </div>
            {rankingDaCategoria && rankingDaCategoria.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="1fr 2fr 1fr 1fr 1fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                        <div><strong>Posição</strong></div>
                        <div><strong>Competidor</strong></div>
                        <div><strong>Situação</strong></div>
                        <div><strong>Graduação</strong></div>
                        <div><strong>Soma Individual</strong></div>
                        <div><strong>Soma Por Dupla</strong></div>
                        <div><strong>Pontuação Total</strong></div>
                        {/* <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div> */}
                    </DataTableHeader>
        
                    <DataTableBody maxHeight="800px">
                        {rankingDaCategoria.map((pontuacao) => (
                            <DataRow key={pontuacao.atletaId} columns="1fr 2fr 1fr 1fr 1fr 1fr 1fr" style={{backgroundColor: (pontuacao.situacao.toUpperCase() === "CANCELADO" ? "var(--color-error-opc)" : "var(--color-bg)")}}>
                                <DataCell>{pontuacao.posicao}°</DataCell>
                                <DataCell>{pontuacao.competidor}({pontuacao.numeroCompetidor})</DataCell>
                                <DataCell>{getDescricaoSituacaoAtletaEnum(pontuacao.situacao)}</DataCell>
                                <DataCell>{pontuacao.graduacao}</DataCell>
                                <DataCell style={{justifyContent: "center", alignItems: "center"}}>{pontuacao.pontuacaoPorAtleta}</DataCell>
                                <DataCell style={{justifyContent: "center", alignItems: "center"}}>{pontuacao.pontuacaoPorDupla}</DataCell>
                                <DataCell>
                                    <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center", gap: "20px"}}>
                                        {pontuacao.totalGeral}                                        
                                    </div>
                                </DataCell>
                            </DataRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            ) : (
                <DataTableMessageEmpty>
                    {rankingDaCategoria && rankingDaCategoria.length == 0 && !loading ? (
                        <span>Nenhum ranking encontrado</span>
                    ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>

                    )}
                </DataTableMessageEmpty>
            )}
            
            {/* <Modal open={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Inscrever Competidor">
                <h1>Em construção</h1>
            </Modal> */}
        
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
