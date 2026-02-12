"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../atoms/Input";
import { Modal } from "../../../modecules/ModalBase";
import { Pagination } from "../../../modecules/Pagination";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader } from "../../../Table";
import { AtletaForm, AtletaListagemDto } from "@/types/atleta";
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
import { FaseDto } from "@/types/fase";

type ConteudoFaseCategoriaProps = {
    categoriaId: string
    campeonatoId: string
}


export function ConteudoFaseCategoria({ categoriaId, campeonatoId }: ConteudoFaseCategoriaProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [fases, setFases] = useState<FaseDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inscricaoAtletaCategoria, setInscricaoAtletaCategoria] = useState(limpaAtletaForm() as InscricaoAtletaCategoriaForm);
    const [competidor, setCompetidor] = useState<SelectOption | null>(null);

    function mostraFases(fases: FaseDto[]){
        setFases(fases);
    }

    function limpaAtletaForm(){
        return {
            atletaId: undefined,
        } as InscricaoAtletaCategoriaForm
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
        FaseService.listaFasesPorCategoriaId(categoriaId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 ? termoBusca : undefined)})
            .then((page) => {
                setPaginaAtual(page.number)
                setTotalDePaginas(page.totalPages)
                mostraFases(page.content)
            })
            .finally(() => setLoading(false));
    }

    async function carregaDados(){
        FaseService.listaFasesPorCategoriaId(categoriaId, {page: paginaAtual, size: 10})
            .then((page) => {
                setPaginaAtual(page.number)
                setTotalDePaginas(page.totalPages)
                mostraFases(page.content)
            })
            .finally(() => setLoading(false));

        console.log(fases)
    }

    useEffect(() => {
        carregaDados();
    }, [paginaAtual, termoBusca]);

    return (
        <div>
            <div style={styles.top}>
                <div style={{width: "25%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Input 
                        placeholder="Digite o nome ou apelido para buscar"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <Button mensagem="Criar nova fase" act={() => {
                    setIsModalOpen(true);
                }}/>
            </div>
            <DataTable>
                <DataTableHeader columns="2fr 2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                    <div><strong>Fase</strong></div>
                    <div><strong>Critério de entrada</strong></div>
                    <div><strong>Situação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody>
                    {fases && fases.length > 0 ? (
                        fases.map((fase) => (
                        <DataRow key={fase.id} columns="2fr 2fr 1fr 1fr">
                            <DataCell>{fase.nome}</DataCell>
                            <DataCell>{fase.criterioEntrada}</DataCell>
                            <DataCell>{fase.situacao}</DataCell>
                            <DataCell style={{display: "flex", justifyContent: 'center'}}>
                            {/* <button onClick={() => router.push(`/atletas/${atleta.id}`)}>
                                Visualizar
                            </button> */}
                            <p>visualizar</p>
                            </DataCell>
                        </DataRow>
                    ))
                    ) : (<strong>Nenhuma fase criada</strong>)}
                </DataTableBody>
            </DataTable>
        
            <div style={styles.footer}>
                {fases && fases.length > 0 && 
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
                        const page = await AtletaService.listaAtletasDoCampeonato(campeonatoId, {page: 0, size: 5, filtro: (query && query.length >= 3 ? query : undefined)});
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
