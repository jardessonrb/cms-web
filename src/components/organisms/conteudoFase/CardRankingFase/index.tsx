"use client";

import { useEffect, useState } from "react";
import { Modal } from "../../../modecules/ModalBase";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "../../../Table";
import { useRouter } from "next/navigation";
import { RankingFaseDto } from "@/types/fase";
import { FaseService } from "@/services/fase-service";
import { Spinner } from "@/components/atoms/Spinner";

type ConteudoCompetidoresProps = {
    faseId: string
    campeonatoId: string
}


export function CardRankingFase({ faseId, campeonatoId }: ConteudoCompetidoresProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rankingDaFase, setRankingDaFase] = useState<RankingFaseDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    async function carregaDados(){
        FaseService.buscaRankingFase(faseId)
            .then((ranking) => {
                setRankingDaFase(ranking)
            })
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        carregaDados();
    }, []);

    return (
        <div>
            <div style={styles.top}>
                {/* <div style={{width: "25%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Input 
                        placeholder="Digite o nome ou apelido para buscar"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div> */}
                {/* <Button mensagem="Inscrever Competidor na Categoria" act={() => {
                    setIsModalOpen(true);
                }}/> */}
                <h1>Pontuação parcial - Ranking</h1>
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
                        <span>Nenhuma categoria encontrado</span>
                    ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>

                    )}
                </DataTableMessageEmpty>
            )}
            
        
            {/* <div style={styles.footer}>
                {rankingDaFase && rankingDaFase.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div> */}
            <Modal open={isModalOpen} onClose={() => {setIsModalOpen(false)}} title="Inscrever Competidor">
                <h1>Em construção</h1>
            </Modal>
        
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
