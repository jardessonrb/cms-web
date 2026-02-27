"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../../../atoms/Input";
import { Modal } from "../../../modecules/ModalBase";
import { Pagination } from "../../../modecules/Pagination";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "../../../Table";
import { AtletaForm, AtletaListagemDto, getDescricaoSituacaoAtletaEnum } from "@/types/atleta";
import { useRouter } from "next/navigation";
import { AtletaService } from "@/services/atleta-service";
import { Button } from "../../../atoms/Button";
import { Utils } from "@/services/utils";
import { Notify } from "@/lib/notify";
import { ExceptionDefault, SelectOption } from "@/types/default";
import { AsyncSelect } from "../../../atoms/AsyncSelect";
import { CategoriaService } from "@/services/categoria-service";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";
import { Spinner } from "@/components/atoms/Spinner";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";

type ConteudoCompetidoresProps = {
    campeonatoId: string
}

export function ConteudoCompetidores({ campeonatoId }: ConteudoCompetidoresProps){
    const router = useRouter();
    const [isLoadingBuscaCompetidores, setIsLoadingBuscaCompetidores] = useState(false);
    const [isLoadingCreateUpdateCompetidor, setIsLoadingCreateUpdateCompetidor] = useState(false);
    const [competidorParaCancelamentoId, setCompetidorParaCancelamentoId] = useState<string | undefined>();
    const [isLoadingImportAtletas, setIsLoadingImportAtletas] = useState(false);
    const [loading, setLoading] = useState(true);
    const [atletas, setAtletas] = useState<AtletaListagemDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [atletaForm, setAtletaForm] = useState(limpaAtletaForm() as AtletaForm);
    const [categoria, setCategoria] = useState<SelectOption | null>(null);
    const [isModalImportacaoOpen, setIsModalImportacaoOpen] = useState<boolean>(false);
    const [arquivoSelecionado, setArquivoSelecionado] = useState<File | null>(null);
    const requestIdRef = useRef(0);

    function mostraAtletas(atletas: AtletaListagemDto[]){
        setAtletas(atletas);
    }

    function limpaAtletaForm(){
        return {
            atletaId: undefined,
            nome: undefined,
            numero: undefined,
            apelido: undefined,
            campeonatoId,
            cidade: undefined,
            dataNascimento: undefined,
            graduacao: undefined, 
            responsavel: undefined,
            grupo: undefined,
            categoriaId: undefined
        }
    }

    async function cadastraAtleta(){
        try {
            setIsLoadingCreateUpdateCompetidor(true);
            const atletaComCategoria = {...atletaForm, categoriaId: categoria?.id}
            const response = await AtletaService.criar(atletaComCategoria);
            Notify.success("Competidor salvo com sucesso.")
            setIsModalOpen(false);
            setAtletaForm(limpaAtletaForm())
            setCategoria(null)
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`Não foi possível salvar o competidor.${exception.erros[0]}`)
            }

            Notify.error("Erro desconhecido ao tentar cadastrar o competidor")
        } finally{
            setIsLoadingCreateUpdateCompetidor(false);
        }
    }

    async function carregaDadosComFiltro(){
        // const requestId = ++requestIdRef.current;
        setIsLoadingBuscaCompetidores(true);
        try{
            // if (requestId !== requestIdRef.current) return;

            const paginaAtletas = await AtletaService.listaAtletasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3  || Utils.isNumeroValido(termoBusca) ? termoBusca : undefined)});
            setTotalDePaginas(paginaAtletas.totalPages);
            setAtletas(paginaAtletas.content);
        }catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar listar competidores.")
            }
        }finally {
            // if (requestId === requestIdRef.current) {
            //     setIsLoadingBuscaCompetidores(false);
            // }

            setIsLoadingBuscaCompetidores(false);
        }
    }

    async function carregaDados(){
        if(!termoBusca || termoBusca?.length == 0){
            const requestId = ++requestIdRef.current;
            setLoading(true);

            try{
                if (requestId !== requestIdRef.current) return;
    
                const paginaAtletas = await AtletaService.listaAtletasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10});
                setTotalDePaginas(paginaAtletas.totalPages);
                mostraAtletas(paginaAtletas.content);
            }catch(error: any){
                if(error.response){
                    const exception = error.response.data as ExceptionDefault;
                    Notify.error(exception.erros[0])
                }else{
                    Notify.error("Erro desconhecido ao tentar listar competidores.")
                }
            }finally {
                if (requestId === requestIdRef.current) {
                    setLoading(false);
                }
            }
        }
    }

    async function abrirModalAtualizacao(atletaId: string){
        const atletaParaAtualizacao = atletas.filter(a => a.id === atletaId)[0];
        const {apelido, cidade, dataNascimento, graduacao, nome, numero, responsavel, grupo, categoriaId, categoria} = atletaParaAtualizacao;

        setAtletaForm({
            apelido,
            atletaId,
            campeonatoId,
            cidade, 
            dataNascimento, 
            graduacao, 
            grupo: grupo != null ? grupo : undefined, 
            nome, 
            numero: numero != null ? numero : undefined, 
            responsavel,
            categoriaId: categoriaId != null ? categoriaId :  undefined
        })

        if(categoriaId != null && categoria != null){
            setCategoria({id: categoriaId, label: categoria})
        }

        setIsModalOpen(true)
    }

    async function atualizaCompetidor() {
        try {
            if(!atletaForm.atletaId){
                Notify.error("É necessário informar o id para atualizar o competidor");
                return;
            }
            
            setIsLoadingCreateUpdateCompetidor(true);
            const atletaComCategoria = {...atletaForm, categoriaId: categoria?.id}
            const response = await AtletaService.atualizar(atletaForm.atletaId, atletaComCategoria);
            Notify.success("Competidor atualizado com sucesso.")
            setIsModalOpen(false);
            setAtletaForm(limpaAtletaForm())
            setCategoria(null)
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`Não foi possível atualizar o competidor.${exception.erros[0]}`)
            }

            Notify.error("Erro desconhecido ao tentar atualizar o competidor")
        } finally{
            setIsLoadingCreateUpdateCompetidor(false);
        }
    }

    function handleSelecionarArquivo(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.name.endsWith(".csv")) {
            Notify.info("Selecione um arquivo CSV válido.");
            return;
        }

        setArquivoSelecionado(file);
    };

    async function handleImportar(){
        if (!arquivoSelecionado) {
            Notify.info("Selecione um arquivo antes de importar.");
            return;
        }
        setIsLoadingImportAtletas(true);
        try{
            const resposta = await AtletaService.importarCSV(campeonatoId, arquivoSelecionado);
            Notify.success(`Arquivo processado com sucesso. ${resposta.registrosEnviados} registros enviados, ${resposta.quantidadeDeAtletasCriados} competidores criados e ${resposta.quantidadeCategoriasCriadas} categorias criadas`, {duration: 3000})
            setTimeout(() => {
                setIsModalImportacaoOpen(false);
                setArquivoSelecionado(null);
                setIsLoadingImportAtletas(false);
                window.location.reload();
            }, 3000);
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar importar competidores do campeonato")
            }
        } finally {
            setIsLoadingImportAtletas(false);
        }

    }

    async function cancelarAtleta(atletaId: string){
        
        try {
            const confirmacao = confirm("Deseja realmente cancelar ? Ao cancelar, todas as disputas do atleta serão não pontuadas. A ação não poderá ser desfeita.")
        
            if(!confirmacao){
                return;
            }

            setIsLoadingCreateUpdateCompetidor(true);
            setCompetidorParaCancelamentoId(atletaId);
            const response = await AtletaService.cancelarAtleta(atletaId);
            Notify.success("Competidor cancelado com sucesso.")
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`Não foi possível cancelar o competidor.${exception.erros[0]}`)
            }

            Notify.error("Erro desconhecido ao tentar cancelar o competidor")
        } finally {
            setIsLoadingCreateUpdateCompetidor(false);
            setCompetidorParaCancelamentoId(undefined);
        }
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
                    <Button mensagem="buscar" style={{height: "20px", marginLeft: 10}} isLoading={isLoadingBuscaCompetidores} act={() => carregaDadosComFiltro()}/>
                </div>
                <div style={{display: "flex", justifyContent: "space-evenly", gap: "20px"}}>
                    <ButtonIcon mensagem="Importação de Competidores" type="IMPORT" act={() => {
                        setIsModalImportacaoOpen(true);
                    }}/>
                    <Button mensagem="Cadastrar Novo Competidor" act={() => {
                        setIsModalOpen(true);
                    }}/>
                </div>
            </div>
            {atletas && atletas.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="2fr 2fr 1fr 1fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px", gap:"10px"}}>
                        <div><strong>Número/Apelido/Nome</strong></div>
                        <div><strong>Grupo/Responsável</strong></div>
                        <div><strong>Graduação</strong></div>
                        <div><strong>Categoria</strong></div>
                        <div><strong>Situação</strong></div>
                        <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                    </DataTableHeader>
        
                    <DataTableBody>
                        {atletas.map((atleta) => (
                            <DataRow key={atleta.id} columns="2fr 2fr 1fr 1fr 1fr 1fr" style={{gap: "10px"}}>
                                <DataCell>
                                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px"}}>
                                        <span style={{fontWeight: "bold", textTransform: "uppercase"}}>{atleta.numero} - {atleta.apelido}</span>
                                        <span>{atleta.nome}</span>
                                    </div>
                                </DataCell>
                                <DataCell>
                                    <div style={{display: "flex", justifyContent: "center", flexDirection: "column", gap: "10px"}}>
                                        <span style={{fontWeight: "bold", textTransform: "uppercase"}}>{atleta.grupo}</span>
                                        <span>{atleta.responsavel}</span>
                                    </div>
                                </DataCell>
                                <DataCell>{atleta.graduacao}</DataCell>
                                <DataCell>{atleta.categoriaId != null ? atleta.categoria : "Sem inscrição"}</DataCell>
                                <DataCell>
                                    <SituacaoEstilizada children={getDescricaoSituacaoAtletaEnum(atleta.situacao)} funcType={situacao => Utils.definirCorConformeSituacaoAtleta(situacao)}/>
                                </DataCell>
                                <DataCell style={{display: "flex", justifyContent: 'center', flexDirection:"row", gap: "20px"}}>
                                    <ButtonIcon mensagem="Editar" act={() => abrirModalAtualizacao(atleta.id)} type="UPDATE"/>
                                    <Button mensagem="Cancelar" isLoading={(isLoadingCreateUpdateCompetidor && competidorParaCancelamentoId === atleta.id) ? true : false} act={() => cancelarAtleta(atleta.id)}
                                        style={{backgroundColor: (atleta.situacao?.toUpperCase() === "CANCELADO" ? "var(--color-error-opc)" : "var(--color-error)")}}
                                        isDisable={(atleta.situacao?.toUpperCase() === "CANCELADO")}
                                    />
                                </DataCell>
                            </DataRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            ) : (
                <DataTableMessageEmpty>
                 {atletas && atletas.length == 0 && !loading ? (
                    <span>Nenhum competidor encontrado</span>
                ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>

                )}
                </DataTableMessageEmpty>
            )}
            
        
            <div style={styles.footer}>
                {atletas && atletas.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={atletaForm.atletaId ? "Atualizar Competidor" : "Novo Competidor"}>
                <Input
                    placeholder="Nome"
                    value={atletaForm.nome}
                    onChange={v => Utils.updateField(setAtletaForm, "nome", v)}
                />
                <Input
                    placeholder="Número"
                    value={atletaForm.numero && Utils.isNumeroValido(String(atletaForm.numero)) ? String(atletaForm.numero) : undefined}
                    onChange={v => Utils.updateField(setAtletaForm, "numero", Number(v))}
                />
                <Input
                    placeholder="Apelido"
                    value={atletaForm.apelido}
                    onChange={v => Utils.updateField(setAtletaForm, "apelido", v)}
                />
                <Input
                    placeholder="Graduação"
                    value={atletaForm.graduacao}
                    onChange={v => Utils.updateField(setAtletaForm, "graduacao", v)}
                />
                <Input
                    placeholder="Responsável"
                    value={atletaForm.responsavel}
                    onChange={v => Utils.updateField(setAtletaForm, "responsavel", v)}
                />
                <Input
                    placeholder="Grupo"
                    value={atletaForm.grupo}
                    onChange={v => Utils.updateField(setAtletaForm, "grupo", v)}
                />
                <Input
                    placeholder="Cidade"
                    value={atletaForm.cidade}
                    onChange={v => Utils.updateField(setAtletaForm, "cidade", v)}
                />
                <Input
                    type="date"
                    placeholder="Data de nascimento. Formato 01/01/2020"
                    value={atletaForm.dataNascimento}
                    onChange={v => Utils.updateField(setAtletaForm, "dataNascimento", v)}
                />

                <AsyncSelect
                    placeholder="Escolher categoria"
                    value={categoria}
                    onSelect={({id, label}) => label && label.length > 0 ? setCategoria({id, label}) : setCategoria({id: "", label: ""})}
                    fetchOptions={async (query) => {
                        const page = await CategoriaService.listaCategoriasDoCampeonato(campeonatoId, {page: 0, size: 5, filtro: (query && query.length >= 3 ? query : undefined)});
                        return page.content.map((c) => ({
                            id: c.id,
                            label: c.nome,
                        }));
                    }}
                />
                {atletaForm.atletaId ? (
                    <Button mensagem="Atualizar Competidor" isLoading={isLoadingCreateUpdateCompetidor} act={() => atualizaCompetidor()} />) : 
                (   <Button mensagem="Cadastrar Competidor" isLoading={isLoadingCreateUpdateCompetidor} act={() => cadastraAtleta()} />)}
            </Modal>
            <Modal open={isModalImportacaoOpen} onClose={() => {setIsModalImportacaoOpen(false), setArquivoSelecionado(null)}} title="Importação de Competidores">
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    <label style={{ cursor: "pointer" }}>
                    <input
                        type="file"
                        accept=".csv"
                        style={{ display: "none" }}
                        onChange={handleSelecionarArquivo}
                    />
                    <div style={{
                        padding: "10px 16px",
                        // backgroundColor: "#1976d2",
                        color: "var(--color-confirm)",
                        borderRadius: 6,
                        textAlign: "center"
                        }}>
                        Selecionar Arquivo CSV
                    </div>
                    </label>

                    {/* Nome do arquivo */}
                    {arquivoSelecionado && (
                        <span>
                        Arquivo selecionado: <strong>{arquivoSelecionado.name}</strong>
                        </span>
                    )}

                    <Button act={handleImportar} isLoading={isLoadingImportAtletas} isDisable={!arquivoSelecionado} style={{opacity: !arquivoSelecionado ? "0.5" : undefined}} mensagem="Importar"/>
                </div>
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
