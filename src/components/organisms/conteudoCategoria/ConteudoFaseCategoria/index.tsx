"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../atoms/Input";
import { Modal } from "../../../modecules/ModalBase";
import { Pagination } from "../../../modecules/Pagination";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "../../../Table";
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
import { comparaCriteriosEntrada, CriterioEntradaEnum, CriteriorEntradaEnum, FaseDto, FaseForm, getDescricaoCriteriorEntradaEnum } from "@/types/fase";
import { Select } from "@/components/atoms/Select";

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
    const [faseForm, setFaseForm] = useState(limpaFaseForm() as FaseForm);
    const CRITERIO_ENTRADA_N_PRIMEIROS = "N_PRIMEIROS";
    const CRITERIO_ENTRADA_TODOS = "TODOS";
    const [faseAnterior, setFaseAnterior] = useState<SelectOption | null>(null);

    function mostraFases(fases: FaseDto[]){
        setFases(fases);
    }

    function limpaAtletaForm(){
        return {
            atletaId: undefined,
        } as InscricaoAtletaCategoriaForm
    }

    function limpaFaseForm() : FaseForm{
        return {
            categoriaId: undefined,
            criterioEntrada: undefined,
            faseAnterior: undefined,
            nome: undefined,
            quantidadeAtletas: undefined
        }
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

    async function criaNovaFase() {
        const body = validaFaseForm();

        if(body == null){
            return;
        }

        try {
            const response = await FaseService.criarFase(body);
            Notify.success(`Fase ${response.nome} criada com sucesso.`)
            setIsModalOpen(false);
            setFaseForm(limpaFaseForm())
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error(`Erro desconhecido ao tentar criar fase ${body.nome}.`)
            }

        }

    }

    function validaFaseForm() : FaseForm | null {
        if(faseForm.criterioEntrada === undefined || faseForm.nome === undefined || faseForm.nome.length == 0){
            Notify.error("É necessário informar o critério de entrada e o nome.")
            return null;
        }

        if(faseForm.criterioEntrada === CRITERIO_ENTRADA_N_PRIMEIROS){
            if(faseForm.faseAnterior === undefined || faseForm.quantidadeAtletas == undefined || faseForm.nome === undefined){
                Notify.error("Quando selecionado N primeiros, é necessário fornecer a quantidade e a fase anterior.")
                return null;
            }
        }

        if(faseForm.criterioEntrada === CRITERIO_ENTRADA_TODOS ){
            return {categoriaId, criterioEntrada: faseForm.criterioEntrada, nome: faseForm.nome} as FaseForm
        }else{
            return { ...faseForm, categoriaId} as FaseForm
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
            {fases && fases.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="2fr 2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                        <div><strong>Fase</strong></div>
                        <div><strong>Critério de entrada</strong></div>
                        <div><strong>Situação</strong></div>
                        <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                    </DataTableHeader>
            
                    <DataTableBody>
                        {fases.map((fase) => (
                            <DataRow key={fase.id} columns="2fr 2fr 1fr 1fr">
                                <DataCell>{fase.nome}</DataCell>
                                <DataCell>{getDescricaoCriteriorEntradaEnum(fase.criterioEntrada)}</DataCell>
                                <DataCell>{fase.situacao}</DataCell>
                                <DataCell style={{display: "flex", justifyContent: 'center'}}>
                                <button onClick={() => router.push(`/categorias/${categoriaId}/fases/${fase.id}`)}>
                                    Visualizar
                                </button>
                                </DataCell>
                            </DataRow>
                        ))}
                    </DataTableBody>
                </DataTable>

            ) : (<DataTableMessageEmpty>Nenhuma fase criada</DataTableMessageEmpty>)}
        
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
                <Input 
                    placeholder="Nome da fase"
                    value={faseForm.nome}
                    onChange={v => Utils.updateField(setFaseForm, "nome", v)}
                />

                <Select
                    value={faseForm.criterioEntrada}
                    onChange={v => Utils.updateField(setFaseForm, "criterioEntrada", v)}
                    placeholder="Selecione o tipo"
                    options={Object.entries(CriterioEntradaEnum).map(
                        ([key, value]) => ({
                            value: key,
                            label: value,
                        }))
                    }
                />

                {faseForm.criterioEntrada === CRITERIO_ENTRADA_N_PRIMEIROS ? (
                    <>
                        <Input
                            placeholder="Quantos competidores. Exemplo: 10"
                            value={String(faseForm.quantidadeAtletas ? faseForm.quantidadeAtletas : "")}
                            onChange={v => Utils.updateField(setFaseForm, "quantidadeAtletas", Number(v))}
                        />

                        <AsyncSelect
                            placeholder="Escolha a categoria anterior"
                            value={faseAnterior}
                            onSelect={option => {setFaseAnterior(option), setFaseForm(prev => {return {...prev, faseAnterior: option.id}})}}
                            fetchOptions={async (query) => {
                                const page = await FaseService.listaFasesPorCategoriaId(categoriaId, {page: 0, size: 5, sort: ["ordem, desc"], filtro: (query && query.length >= 3 ? query : undefined)});
                                return page.content.map((fase) => ({
                                    id: fase.id,
                                    label: `Ordem: ${fase.ordem} - ${fase.nome}`,
                                }));
                            }}
                        />
                    </>


                ) : 
                (<></>)}

                <Button mensagem="Criar nova fase" act={() => criaNovaFase()} />
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
