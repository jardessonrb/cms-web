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
import { comparaCriteriosEntrada, CriterioEntradaEnum, CriteriorEntradaEnum, FaseDto, FaseForm, getDescricaoCriteriorEntradaEnum, getDescricaoSituacaoFaseEnum } from "@/types/fase";
import { Select } from "@/components/atoms/Select";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";
import { Spinner } from "@/components/atoms/Spinner";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";

type ConteudoFaseCategoriaProps = {
    categoriaId: string
    campeonatoId: string
}


export function ConteudoFaseCategoria({ categoriaId, campeonatoId }: ConteudoFaseCategoriaProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isLoadingBuscaFases, setIsLoadingBuscaFases] = useState(false);
    const [isLoadingCreateUpdate, setIsLoadingCreateUpdate] = useState(false);
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
            faseAnteriorId: undefined,
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

        if(body.criterioEntrada === CRITERIO_ENTRADA_N_PRIMEIROS && (!body.faseAnteriorId || !body.quantidadeAtletas)){
            return;
        }

        try{
            if(body.criterioEntrada === CRITERIO_ENTRADA_N_PRIMEIROS && body.faseAnteriorId && body.quantidadeAtletas){
                setIsLoadingCreateUpdate(true);
                const validacao = await FaseService.validarCorteNovaFase(body.faseAnteriorId, body.quantidadeAtletas);
    
                if(validacao.quantidadeEmpatados > 0){
                    const confirmacao = confirm(`A fase anterior possui ${validacao.quantidadeEmpatados} competidores empatados. Deseja criar uma nova rodada de desempate na fase ${faseAnterior?.label} ?`)
    
                    if(!confirmacao){
                        return;
                    }
                }
            
            }
        }catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error(`Erro desconhecido ao tentar validar a criação da nova fase ${body.nome}.`)
            }

        } finally {
            setIsLoadingCreateUpdate(false);
        }

        try {
            setIsLoadingCreateUpdate(true);
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

        }finally{
            setIsLoadingCreateUpdate(false);
        }

    }

    function validaFaseForm() : FaseForm | null {
        if(faseForm.criterioEntrada === undefined || faseForm.nome === undefined || faseForm.nome.length == 0){
            Notify.error("É necessário informar o critério de entrada e o nome.")
            return null;
        }

        if(faseForm.criterioEntrada === CRITERIO_ENTRADA_N_PRIMEIROS){
            if(faseForm.faseAnteriorId === undefined || faseForm.quantidadeAtletas == undefined || faseForm.nome === undefined){
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
        try{
            setIsLoadingBuscaFases(true);
            const paginasFases = await FaseService.listaFasesPorCategoriaId(categoriaId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 || Utils.isNumeroValido(termoBusca) ? termoBusca : undefined)})
            setTotalDePaginas(paginasFases.totalPages)
            mostraFases(paginasFases.content)
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar listar fases da categoria")
            }
        } finally {
            setIsLoadingBuscaFases(false);
        }
        
    }

    async function carregaDados(){
        try{
            setLoading(true);
            const paginasFases = await FaseService.listaFasesPorCategoriaId(categoriaId, {page: paginaAtual, size: 10});
            setTotalDePaginas(paginasFases.totalPages)
            setFases(paginasFases.content)
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar listar fases da categoria")
            }
        } finally {
            setLoading(false);
        }
    }

    function definirCorConformeSituacao(situacao: string) : SituacaoType {
        if(situacao === "Iniciada" || situacao === "Criada"){
          return "SUCCESS"
        }
    
        if(situacao === "Finalizada"){
          return "CONFIRM"
        }

        if(situacao === "Aguardando Desempate"){
          return "ALERT"
        }
    
        return "DANGER"
      }
    

    useEffect(() => {
        carregaDados();
    }, [paginaAtual, termoBusca]);

    return (
        <div>
            <div style={styles.top}>
                <div style={{width: "25%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Input 
                        placeholder="Digite o nome da fase para buscar"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" isLoading={isLoadingBuscaFases} style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <Button mensagem="Criar nova fase" act={() => {
                    setIsModalOpen(true);
                }}/>
            </div>
            {fases && fases.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="2fr 2fr 1fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                        <div><strong>Fase</strong></div>
                        <div><strong>Critério de entrada</strong></div>
                        <div><strong>Situação</strong></div>
                        <div><strong>Fase Anterior</strong></div>
                        <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                    </DataTableHeader>
            
                    <DataTableBody>
                        {fases.map((fase) => (
                            <DataRow key={fase.id} columns="2fr 2fr 1fr 1fr 1fr">
                                <DataCell>
                                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px"}}>
                                        <span style={{fontWeight: "bold", textTransform: "uppercase"}}>{fase.nome}</span>
                                        <span>Ordem: {fase.ordem}</span>
                                    </div>
                                </DataCell>
                                <DataCell>
                                    <SituacaoEstilizada children={getDescricaoCriteriorEntradaEnum(fase.criterioEntrada)} funcType={criterio => "CONFIRM"}/>
                                </DataCell>
                                <DataCell>
                                    <SituacaoEstilizada children={getDescricaoSituacaoFaseEnum(fase.situacao)} funcType={situacao => definirCorConformeSituacao(situacao)}/>
                                </DataCell>
                                <DataCell>
                                    {fase.faseAnterior ? (
                                        <div style={{display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px"}}>
                                            <span style={{fontWeight: "bold", textTransform: "uppercase"}}>{fase.faseAnterior.nome}</span>
                                            <span>Ordem: {fase.faseAnterior.ordem}</span>
                                        </div>
                                    ) : (
                                        <span style={{fontWeight: "bold", textTransform: "uppercase"}}>Não possui fase anterior</span>
                                    )}
                                </DataCell>
                                <DataCell style={{display: "flex", justifyContent: 'center'}}>
                                    <ButtonIcon 
                                        mensagem="Visualizar"
                                        type="OPEN"
                                        act={() => router.push(`/categorias/${categoriaId}/fases/${fase.id}`)}
                                    />
                                </DataCell>
                            </DataRow>
                        ))}
                    </DataTableBody>
                </DataTable>

            ) : (
                 <DataTableMessageEmpty>
                    {fases && fases.length == 0 && !loading ? (
                        <span>Nenhuma fase encontrado</span>
                    ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>
        
                    )}
                </DataTableMessageEmpty>
            )}
        
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
                            onSelect={option => {setFaseAnterior(option), setFaseForm(prev => {return {...prev, faseAnteriorId: option.id}})}}
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

                <Button mensagem="Criar nova fase" isLoading={isLoadingCreateUpdate} act={() => criaNovaFase()} />
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
