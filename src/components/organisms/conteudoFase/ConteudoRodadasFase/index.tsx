"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../atoms/Input";
import { Modal } from "../../../modecules/ModalBase";
import { Pagination } from "../../../modecules/Pagination";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader } from "../../../Table";
import { useRouter } from "next/navigation";
import { AtletaService } from "@/services/atleta-service";
import { Button } from "../../../atoms/Button";
import { Utils } from "@/services/utils";
import { Notify } from "@/lib/notify";
import { ExceptionDefault, SelectOption } from "@/types/default";
import { AsyncSelect } from "../../../atoms/AsyncSelect";
import { CategoriaService } from "@/services/categoria-service";
import { InscricaoAtletaCategoriaForm } from "@/types/inscricao-atleta-categoria";
import { FaseService } from "@/services/fase-service";
import { CriteriorEntradaEnum, FaseDto } from "@/types/fase";
import { getDescricaoSituacaoRodadaEnum, getDescricaoTipoRodadaEnum, RodadaDto } from "@/types/roda";
import { RodadaService } from "@/services/rodada-service";
import { ListagemDisputa } from "../ListagemDisputa";

type ConteudoFaseCategoriaProps = {
    categoriaId: string
    faseId: string
}

export function ConteudoRodasFase({ categoriaId, faseId }: ConteudoFaseCategoriaProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [rodadas, setRodadas] = useState<RodadaDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inscricaoAtletaCategoria, setInscricaoAtletaCategoria] = useState(limpaAtletaForm() as InscricaoAtletaCategoriaForm);
    const [competidor, setCompetidor] = useState<SelectOption | null>(null);

    const [isAtivo, setIsAtivo] = useState(false);
    const [rodadaAbertaExpandidaId, setRodadaAbertaExpandidaId] = useState<string | null>(null);
    const [rodadasExpandidas, setRodadasExpandidas] = useState<Set<string>>(new Set());

    function mostraRodadas(rodadas: RodadaDto[]){
        setRodadas(rodadas);
    }

    function limpaAtletaForm(){
        return {
            atletaId: undefined,
        } as InscricaoAtletaCategoriaForm
    }

    function ajusteRodadasExpandidas(rodadaId: string){
        setRodadasExpandidas(prev => {
            const next = new Set(prev);
            if (next.has(rodadaId)) {
            next.delete(rodadaId);
            } else {
            next.add(rodadaId);
            }
            return next;
        });
    }

    async function inscreveAtletaEmCategoria(){
        if(!competidor?.id){
            Notify.error(`É preciso escolher uma atleta para inscrever na categoria.`)
            return;
        }

        try {
            await CategoriaService.inscreverAtletaEmCategoria(categoriaId, competidor?.id);
            Notify.success("Competidor inscrito na categoria com sucesso.")
            setIsModalOpen(false);
            setCompetidor(null)
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar inscrever o competidor no categoria")
            }

        }
    }

    async function carregaDadosComFiltro(){
        RodadaService.listaRodadaPorFaseId(faseId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 ? termoBusca : undefined)})
            .then((page) => {
                setPaginaAtual(page.number)
                setTotalDePaginas(page.totalPages)
                mostraRodadas(page.content)
            })
            .finally(() => setLoading(false));
    }

    async function carregaDados(){
        RodadaService.listaRodadaPorFaseId(faseId, {page: paginaAtual, size: 10})
            .then((page) => {
                setPaginaAtual(page.number)
                setTotalDePaginas(page.totalPages)
                mostraRodadas(page.content)
            })
            .finally(() => setLoading(false));

        console.log(rodadas)
    }

    useEffect(() => {
        carregaDados();
    }, [paginaAtual, termoBusca]);

    return (
        <div>
            <div style={styles.top}>
                <div style={{width: "25%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Input 
                        placeholder="Digite o nome da rodada para buscar"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <Button mensagem="Criar nova rodada" act={() => {
                    setIsModalOpen(true);
                }}/>
            </div>
            <DataTable>
                <DataTableHeader columns="2fr 1fr 2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                    <div><strong>Rodada</strong></div>
                    <div><strong>Tipo da rodada</strong></div>
                    <div><strong>Disputas Concluídas</strong></div>
                    <div><strong>Situação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody>
                    {rodadas && rodadas.length > 0 ? (
                        rodadas.map((rodada) => {
                            // const isMostraConteudoExpandidoLinha = rodadaAbertaExpandidaId === rodada.id;
                            const isMostraConteudoExpandidoLinha = rodadasExpandidas.has(rodada.id);
                            return (
                                <DataRow key={rodada.id} columns="2fr 1fr 2fr 1fr 1fr" expandContent={<ListagemDisputa faseId={faseId} />} isExpanded={isMostraConteudoExpandidoLinha}>
                                    <DataCell>{rodada.nome}</DataCell>
                                    <DataCell>{getDescricaoTipoRodadaEnum(rodada.tipoRodada)}</DataCell>
                                    <DataCell>{rodada.disputasConcluidas} de {rodada.disputasConcluidas + rodada.disputasPendentes}</DataCell>
                                    <DataCell>{getDescricaoSituacaoRodadaEnum(rodada.situacao)}</DataCell>
                                    <DataCell style={{display: "flex", flexDirection: 'column', justifyContent: 'space-between'}}>
                                        <button onClick={() => ajusteRodadasExpandidas(rodada.id)}>
                                        {isMostraConteudoExpandidoLinha ? (<p>Esconder</p>) : (<p>Ver</p>)}
                                        </button>
                                    </DataCell>
                                </DataRow>
                            )
                        })
                    ) : (<strong>Nenhuma rodada encontrada criada</strong>)}
                </DataTableBody>
            </DataTable>
        
            <div style={styles.footer}>
                {rodadas && rodadas.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div>
            <Modal open={isModalOpen} onClose={() => {setIsModalOpen(false), setCompetidor(null)}} title="Criar nova fase">
                <AsyncSelect
                    placeholder="Escolher Competidor"
                    value={competidor}
                    onSelect={setCompetidor}
                    fetchOptions={async (query) => {
                        const page = await AtletaService.listaAtletasDoCampeonato("", {page: 0, size: 5, filtro: (query && query.length >= 3 ? query : undefined)});
                        return page.content.map((c) => ({
                            id: c.id,
                            label: `${c.numero} - ${c.nome}(${c.apelido})`,
                        }));
                    }}
                />
                <Button mensagem="Criar nova fase" act={inscreveAtletaEmCategoria} />
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
