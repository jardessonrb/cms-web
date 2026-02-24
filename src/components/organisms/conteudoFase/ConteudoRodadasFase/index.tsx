"use client";

import { use, useEffect, useState } from "react";
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
import { CriteriorEntradaEnum, FaseDto } from "@/types/fase";
import { GeracaoRodadaForm, getDescricaoSituacaoRodadaEnum, getDescricaoTipoRodadaEnum, RodadaDto, SituacaoRodadaEnum } from "@/types/roda";
import { RodadaService } from "@/services/rodada-service";
import { ListagemDisputa } from "../ListagemDisputa";
import { CardRegistroDeNotas } from "../CardRegistroDeNotas";
import { AtletaNotasForm, DisputaDto, getDescricaoSituacaoDisputaEnum, getDescricaoTipoRegistroDisputaEnum, NotaForm, NotasDto, RegistroDeNotasForm, RegistroDisputaDto, SituacaoDisputaEnum, TipoDisputaEnum, TipoRegistroDisputaEnum } from "@/types/disputa";
import { DisputaService } from "@/services/disputa-service";
import { JuradoService } from "@/services/jurado-service";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";
import Image from "next/image";
import { Spinner } from "@/components/atoms/Spinner";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";

type ConteudoFaseCategoriaProps = {
    categoriaId: string
    faseId: string
    campeonatoId: string
}

export function ConteudoRodasFase({ categoriaId, faseId, campeonatoId }: ConteudoFaseCategoriaProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isLoadingBuscaRodada, setIsLoadingBuscaRodada] = useState(false);
    const [isLoadingGeracaoRodadas, setIsLoadingGeracaoRodadas] = useState(false);
    const [isLoadingDisputaParaRegistroNotas, setIsLoadingDisputaParaRegistroNotas] = useState(false);
    const [rodadas, setRodadas] = useState<RodadaDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalAdicionarRodadaOpen, setIsModalAdicionarRodadaOpen] = useState<boolean>(false);
    const [isModalGeracaoFases, setIsModalGeracaoFases] = useState<boolean>(false);
    const [inscricaoAtletaCategoria, setInscricaoAtletaCategoria] = useState(limpaAtletaForm() as InscricaoAtletaCategoriaForm);
    const [competidor, setCompetidor] = useState<SelectOption | null>(null);

    const [rodadasExpandidas, setRodadasExpandidas] = useState<Set<string>>(new Set());
    const [isModalRegistroNotaOpen, setIsModalRegistroNotaOpen] = useState<boolean>(false);
    const [disputaAtualParaRegistroNota, setDisputaAtualParaRegistroNota] = useState<DisputaDto>()
    const [registroAtleta1, setRegistroAtleta1] = useState<AtletaNotasForm | null>()
    const [registroAtleta2, setRegistroAtleta2] = useState<AtletaNotasForm | null>()
    const [reloadKeyChildren, setReloadKeyChildren] = useState<number>(0)
    const [jurados, setJurados] = useState<SelectOption[]>([]);
    const [jurado, setJurado] = useState<SelectOption>();
    const [fase, setFase] = useState<FaseDto>();

    const [rodadasForm, setRodadasForm] = useState<GeracaoRodadaForm[]>([{ nome: "", faseId: faseId }])
    const SITUACAO_RODADA_FINALIZADA = "FINALIZADA";
    const [novaRodadaForm, setNovaRodadaForm] = useState<GeracaoRodadaForm>();

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

    function atualizaJurado(index: number, jurado: SelectOption) {
        setJurados(prev => {
            const novo = [...prev];

            novo[index] = jurado;

            return novo;
        });

    }

    async function abrirModalDeRegistroDeNota(disputaId: string){
        try {

            setIsModalRegistroNotaOpen(true);
            setIsLoadingDisputaParaRegistroNotas(true);
            const disputaResponse = await DisputaService.buscaDisputaPorId(disputaId);
            const registrosOrdenados = [...(disputaResponse.registrosDisputa ?? [])]
                .sort((a, b) => a.numeroAtleta - b.numeroAtleta)
                .map(registro => ({
                    ...registro,
                    notas: registro.notas ? [...registro.notas].sort((a, b) =>a.juradoId.localeCompare(b.juradoId)): []
                }));

            const disputaOrdenada = {
                ...disputaResponse,
                registrosDisputa: registrosOrdenados
            };

            setDisputaAtualParaRegistroNota(disputaOrdenada);
            
            const notasDoRegistro = extrairNotas(registrosOrdenados);
            if (notasDoRegistro && notasDoRegistro.length === 3) {
                const juradosParaSelect: SelectOption[] = notasDoRegistro.map(nota => ({
                    id: nota.juradoId,
                    label: nota.juradoNome
                }));

                setJurados(juradosParaSelect);
            }

        } catch (error: any) {
            if (error.response) {
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`);
            } else {
                Notify.error("Erro desconhecido ao tentar inscrever o competidor na categoria");
            }
        } finally{
            setIsLoadingDisputaParaRegistroNotas(false);
        }

    }

    function extrairNotas(registros: RegistroDisputaDto[]) : NotasDto[]{
        return registros.filter(r => getDescricaoTipoRegistroDisputaEnum(r.tipoRegistro).toUpperCase() === "PONTUADO")[0].notas;
    }

    async function carregaDadosComFiltro(){  
        try{
            setIsLoadingBuscaRodada(true);
            const paginaRodada = await RodadaService.listaRodadaPorFaseId(faseId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 ? termoBusca : undefined)})
            setTotalDePaginas(paginaRodada.totalPages)
            setRodadas(paginaRodada.content);

        }catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar buscar rodadas")
            }
        } finally {
            setIsLoadingBuscaRodada(false);
        }
    }

    async function carregaDados(){
        try{
            setLoading(true);
            const paginaRodada = await RodadaService.listaRodadaPorFaseId(faseId, {page: paginaAtual, size: 10});
            setTotalDePaginas(paginaRodada.totalPages)
            setRodadas(paginaRodada.content);

        }catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar listar rodadas")
            }
        } finally {
            setLoading(false);
        }
        
        FaseService.buscaFasePorId(faseId)
            .then((resultado) => {
                setFase(resultado)
            })
        .catch((error) => console.log("carregaDados"))
    }

    function geraBodyRegistroDeNotas() : RegistroDeNotasForm | null{
        if(jurados.length != 3){
            Notify.error("Todos os 3 jurados devem estar selecionados.")
            return null;
        }

        const registros = [registroAtleta1, registroAtleta2].filter(reg => reg != undefined);
        for(let i = 0; i < registros.length; i++){
            for(let j = 0; j < registros[i].notas.length; j++){
                registros[i].notas[j].juradoId = jurados[j].id
            }
        }
        const body = {atletas: registros} as RegistroDeNotasForm

        return body;
    }

    async function salvarNotas(){
        const body: RegistroDeNotasForm | null = geraBodyRegistroDeNotas();
        if(body == null){
            return;
        }

        if(disputaAtualParaRegistroNota?.id == undefined){
            Notify.error("É necessário informar a disputa que deve haver registro de notas.")
            return null;
        }

        try {
            const resposta = await DisputaService.registrarNotas(disputaAtualParaRegistroNota?.id, body);
            Notify.success("Notas registradas com sucesso.")
            setIsModalRegistroNotaOpen(false);
            setDisputaAtualParaRegistroNota(undefined);
            setRegistroAtleta1(null);
            setRegistroAtleta2(null);
            setJurados([])
            setReloadKeyChildren(prev => prev + 1)
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar registrar as notas.")
            }
        }
    }
    
    async function atualizarNotas(){
        const body: RegistroDeNotasForm | null = geraBodyRegistroDeNotas();
        if(body == null){
            return;
        }
        
        if(disputaAtualParaRegistroNota?.id == undefined){
            Notify.error("É necessário informar a disputa que deve haver registro de notas.")
            return null;
        }

       try {
            const resposta = await DisputaService.atualizarNotas(disputaAtualParaRegistroNota?.id, body);
            Notify.success("Notas atualizadas com sucesso.")
            setIsModalRegistroNotaOpen(false);
            setDisputaAtualParaRegistroNota(undefined);
            setRegistroAtleta1(null);
            setRegistroAtleta2(null);
            setReloadKeyChildren(prev => prev + 1)
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar atualizar as notas.")
            }
        }
    }

    function closeModalDeRegistroNotas(){
        setIsModalRegistroNotaOpen(false); 
        setDisputaAtualParaRegistroNota(undefined)
        setRegistroAtleta1(null)
        setRegistroAtleta2(null);
        setJurados([])
    }

    async function finalizarRodada(rodadaId: string, nomeRodada: string){
        try {
            const confirmacao = confirm(`Deseja realmente encerrar a rodada ${nomeRodada} ?`)

            if(!confirmacao){
                return;
            }

            const resposta = await RodadaService.finalizarRodada(rodadaId);
            Notify.success(`Rodada ${resposta.nome} finalizada com sucesso.`)
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar finalizar.")
            }
        }
    }

    async function gerarRodadas(){
        try {        
            const rodadasFormFiltradas: GeracaoRodadaForm[] = rodadasForm.filter(rodada => rodada && rodada.nome && rodada.nome.length > 0);
            if(rodadasFormFiltradas.length == 0){
                Notify.error("É necessário criar pelo menos uma rodada válida.")
                return;
            }

            const confirmacao = confirm(`Deseja criar ${rodadasFormFiltradas.length} rodadas ?`)

            if(!confirmacao){
                return;
            }
            
            setIsLoadingGeracaoRodadas(true);
            const resposta = await RodadaService.gerarRodadas(faseId, rodadasFormFiltradas);
            Notify.success(`${resposta.length} rodadas geradas com sucesso.`)
            setIsModalGeracaoFases(false);
            setRodadasForm([])
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar gerar rodadas.")
            }
        } finally{
            setIsLoadingGeracaoRodadas(false);
        }
    }

    function atualizaNomeRodada(index: number, value: string) {
        const novasRodadas: GeracaoRodadaForm[] = [...rodadasForm];
        novasRodadas[index].nome = value;
        setRodadasForm(novasRodadas);
    };

    function adicionaRodada(){
        setRodadasForm(prev => [
            ...prev,
            { nome: "", faseId }
        ]);
    }

    async function finalizarFase(faseId:string) {
         try {        
            const confirmacao = confirm(`Deseja finalizar a fase ${fase?.nome} ?`)

            if(!confirmacao){
                return;
            }

            const resposta = await FaseService.finalizarFase(faseId);
            Notify.success(`Fase ${resposta.nome} finalizada com sucesso.`)
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar finalizar fase.")
            }
        }
    }

    async function salvaNovaRodada(){
         try {        
            
            if(!novaRodadaForm){
                return;
            }

            const resposta = await RodadaService.criarNovaRodada(novaRodadaForm);
            Notify.success(`Rodada ${novaRodadaForm?.nome} criada com sucesso.`)
            setIsModalAdicionarRodadaOpen(false);
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar gerar rodadas.")
            }
        }
    }

    function definirCorConformeSituacao(situacao: string) : SituacaoType {
        if(situacao === "Ativa" || situacao === "Criada"){
          return "SUCCESS"
        }
    
        if(situacao === "Finalizada"){
          return "CONFIRM"
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
                        placeholder="Digite o nome da rodada para buscar"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" isLoading={isLoadingBuscaRodada} style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <div style={{display: "flex", justifyContent: "space-evenly", flexDirection: "row"}}>
                    {(rodadas && rodadas.every(rodada => rodada.situacao.toUpperCase() === SITUACAO_RODADA_FINALIZADA) && fase?.situacao.toUpperCase() != SITUACAO_RODADA_FINALIZADA) && (
                        <Button 
                            mensagem="Finalizar Fase" 
                            act={() => finalizarFase(faseId)}
                            style={{marginRight: "10px"}}
                        />
                    )}
                    {(fase && fase?.situacao.toUpperCase() != SITUACAO_RODADA_FINALIZADA && fase.situacao.toUpperCase() != "AGUARDANDO_DESEMPATE") && (
                        <>
                            {fase && fase.quantidadeRodadas == 0 ? (
                                <Button mensagem="Gerar rodadas" act={() => {
                                    setIsModalGeracaoFases(true);
                                }}/>
                            ) : (
                                <Button mensagem="Criar nova rodada" act={() => {
                                    setIsModalAdicionarRodadaOpen(true);
                                }}/>
                            )}
                        </>
                    )}
                </div>
                
            </div>
            {rodadas && rodadas.length > 0 ? (
                <DataTable>
                <DataTableHeader columns="1fr 1fr 1fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                    <div><strong>Rodada</strong></div>
                    <div><strong>Tipo da rodada</strong></div>
                    <div><strong>Disputas Concluídas</strong></div>
                    <div><strong>Situação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody>
                    {rodadas.map((rodada) => {
                        // const isMostraConteudoExpandidoLinha = rodadaAbertaExpandidaId === rodada.id;
                        const isMostraConteudoExpandidoLinha = rodadasExpandidas.has(rodada.id);
                        return (
                            <DataRow key={rodada.id} columns="1fr 1fr 1fr 1fr 1fr" 
                                expandContent={
                                    <ListagemDisputa
                                        key={`${rodada.id}-${reloadKeyChildren}`} 
                                        faseId={faseId} 
                                        rodadaId={rodada.id} 
                                        act={disputaId => abrirModalDeRegistroDeNota(disputaId)} 
                                    />} 
                                isExpanded={isMostraConteudoExpandidoLinha}
                                >
                                <DataCell>{rodada.nome}</DataCell>
                                <DataCell>{getDescricaoTipoRodadaEnum(rodada.tipoRodada)}</DataCell>
                                <DataCell>{rodada.disputasConcluidas} de {rodada.disputasConcluidas + rodada.disputasPendentes}</DataCell>
                                <DataCell>
                                    <SituacaoEstilizada children={getDescricaoSituacaoRodadaEnum(rodada.situacao)} funcType={situacao => definirCorConformeSituacao(situacao)} />
                                </DataCell>
                                <DataCell style={{display: "flex", flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center'}}>
                                    {rodada.situacao.toUpperCase() != SituacaoRodadaEnum.FINALIZADA.toUpperCase() ? (
                                        <Button 
                                            mensagem="Finalizar rodada"
                                            act={() => finalizarRodada(rodada.id, rodada.nome)}
                                            isDisable={rodada.disputasConcluidas != (rodada.disputasConcluidas + rodada.disputasPendentes) || rodada.situacao.toUpperCase() == SituacaoRodadaEnum.FINALIZADA.toUpperCase()}
                                            style={{opacity: (rodada.disputasConcluidas != (rodada.disputasConcluidas + rodada.disputasPendentes) || rodada.disputasConcluidas != (rodada.disputasConcluidas + rodada.disputasPendentes) || rodada.situacao.toUpperCase() == SituacaoRodadaEnum.FINALIZADA.toUpperCase()) ? "0.5" : "1.0"}}
                                        />
                                    ) : (<></>)}
                                    
                                   <button onClick={() => ajusteRodadasExpandidas(rodada.id)} style={{ border: "none", background: "none", cursor: "pointer"}}>
                                        {isMostraConteudoExpandidoLinha ? <ButtonIcon type="UP" mensagem="Retrair"/> : <ButtonIcon type="DOWN" mensagem="Expandir"/> }
                                    </button>
                                </DataCell>
                            </DataRow>
                        )
                    })}
                </DataTableBody>
            </DataTable>
            ) : (
                <DataTableMessageEmpty>
                    {rodadas && rodadas.length == 0 && !loading ? (
                    <span>Nenhuma rodada encontrada</span>
                    ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>
        
                    )}
                </DataTableMessageEmpty>
            )}
            
        
            <div style={styles.footer}>
                {rodadas && rodadas.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div>
            <Modal open={isModalGeracaoFases} onClose={() => {setIsModalGeracaoFases(false)}} title="Gerar rodadas">
                {rodadasForm.map((rodada, index) => (
                    <div style={{display: "flex", justifyContent: 'space-between', alignContent: 'center', flexDirection: 'row'}}>
                        <Input
                            key={index}
                            placeholder={`Digite o nome da ${index + 1}° rodada`}
                            style={{ width: "90%", marginBottom: 8 }}
                            value={rodada.nome}
                            onChange={(value) => atualizaNomeRodada(index, value)}
                        />
                        {(index + 1) === rodadasForm.length && (
                            <Button 
                                key={`b-${index}`}
                                mensagem="+"
                                act={() => adicionaRodada()}
                                style={{padding: "5px 5px", width: "30px"}}
                            />
                        )}
                        
                    </div>
                ))}
                <Button mensagem="Gerar rodadas" isLoading={isLoadingGeracaoRodadas} act={() => gerarRodadas()} />
            </Modal>

            <Modal open={isModalRegistroNotaOpen} onClose={() => closeModalDeRegistroNotas()} modalStyle={{maxWidth: "900px"}} title="Registrar Notas da Disputa">
                {(!isLoadingDisputaParaRegistroNotas && disputaAtualParaRegistroNota && getDescricaoSituacaoDisputaEnum(disputaAtualParaRegistroNota?.situacao).toUpperCase() === SituacaoDisputaEnum.CANCELADA.toUpperCase())  ? (
                    <div style={{display: "flex", justifyContent: "center", alignItems: 'center', padding: "20px"}}>
                        <h3 style={{color: "var(--color-error)"}}>A disputa foi cancelada</h3>
                    </div>
                ) : (
                <>
                    {!isLoadingDisputaParaRegistroNotas ? (
                        <>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" , gap: "10px" }}>
        
                                <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', maxWidth: "300px"}}>
                                    <CardRegistroDeNotas
                                        registro={disputaAtualParaRegistroNota?.registrosDisputa[0]}
                                        onChangeNotas={(atletaId, notas) => setRegistroAtleta1({atletaId, notas})}
                                        campeonatoId={campeonatoId}
                                    />
                                </div>
            
                                <div style={styles.containerEscolhaJuradosContainer}>
                                    <div style={styles.containerEscolhaJuradosHeader}>
                                        <strong>Escolha os Jurados</strong>
                                    </div>
                                    <div style={styles.containerEscolhaJuradosMain}>
                                        <AsyncSelect
                                            placeholder="Escolher Jurado"
                                            value={jurados.length == 3 ? jurados[0] : jurado}
                                            onSelect={(value) => atualizaJurado(0, value)}
                                            fetchOptions={async (query) => {
                                                const page = await JuradoService.listaJuradosDoCampeonato(campeonatoId, {
                                                page: 0,
                                                size: 5,
                                                filtro: query && query.length >= 3 ? query : undefined,
                                                });
                                
                                                return page.content.map((jurado) => ({
                                                    id: jurado.id,
                                                    label: `${jurado.apelido}-${jurado.grupo}`,
                                                }));
                                            }}  
                                        />
            
                                        <AsyncSelect
                                            placeholder="Escolher Jurado"
                                            value={jurados.length == 3 ? jurados[1] : jurado}
                                            onSelect={(value) => atualizaJurado(1, value)}
                                            fetchOptions={async (query) => {
                                                const page = await JuradoService.listaJuradosDoCampeonato(campeonatoId, {
                                                page: 0,
                                                size: 5,
                                                filtro: query && query.length >= 3 ? query : undefined,
                                                });
                                
                                                return page.content.map((jurado) => ({
                                                    id: jurado.id,
                                                    label: `${jurado.apelido}-${jurado.grupo}`,
                                                }));
                                            }}  
                                        />
            
                                        <AsyncSelect
                                            placeholder="Escolher Jurado"
                                            value={jurados.length == 3 ? jurados[2] : jurado}
                                            onSelect={(value) => atualizaJurado(2, value)}
                                            fetchOptions={async (query) => {
                                                const page = await JuradoService.listaJuradosDoCampeonato(campeonatoId, {
                                                page: 0,
                                                size: 5,
                                                filtro: query && query.length >= 3 ? query : undefined,
                                                });
                                
                                                return page.content.map((jurado) => ({
                                                    id: jurado.id,
                                                    label: `${jurado.apelido}-${jurado.grupo}`,
                                                }));
                                            }}  
                                        />
                                    </div>
                                </div>
            
                                <div style={{display: "flex", justifyContent: 'center', alignItems: 'center', maxWidth: "300px"}}>
                                    {disputaAtualParaRegistroNota?.registrosDisputa.length === 2 ? (
                                        <CardRegistroDeNotas
                                            registro={disputaAtualParaRegistroNota?.registrosDisputa[1]}
                                            onChangeNotas={(atletaId, notas) => setRegistroAtleta2({atletaId, notas})}
                                            campeonatoId={campeonatoId}
                                        />
                                    ) : (<div>Disputa do tipo individual só permite um competidor</div>)}
                                </div>                
                            </div>
                            <Button style={{width: "50%", alignSelf: 'center'}} 
                                mensagem={getDescricaoSituacaoDisputaEnum(disputaAtualParaRegistroNota?.situacao).toUpperCase() === SituacaoDisputaEnum.CONCLUIDA.toUpperCase() ? "Atualizar Notas" : "Registrar Notas"} 
                                act={getDescricaoSituacaoDisputaEnum(disputaAtualParaRegistroNota?.situacao).toUpperCase() === SituacaoDisputaEnum.CONCLUIDA.toUpperCase()  ? atualizarNotas : salvarNotas} 
                            />
                        </>

                    ) : (
                        <div style={{display: "flex", justifyContent: 'center', alignItems: "center", gap: "10px"}}>
                            <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                            <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                        </div>
                    )}
                </>
                )}
            </Modal>

            <Modal open={isModalAdicionarRodadaOpen} onClose={() => {setIsModalAdicionarRodadaOpen(false), setNovaRodadaForm(undefined)}} title="Adicionar nova rodada">
                <Input 
                    value={novaRodadaForm?.nome}
                    onChange={value => setNovaRodadaForm({nome: value, faseId: faseId})}
                    placeholder="Nome da rodada"
                />
                <Button style={{width: "50%", alignSelf: 'center'}} mensagem="Salvar rodada" act={() => salvaNovaRodada()}/>
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
    },
    containerEscolhaJuradosContainer: {
        display: "grid",
        gridTemplateRows: "1fr 1fr",
        maxWidth: "300px",
        // backgroundColor: "#9ACD32"
    },
    containerEscolhaJuradosHeader: {
        width: "100%",
        display: "flex",
        justifyContent: 'center',
        // backgroundColor: "#B8860B"
    },
    containerEscolhaJuradosMain: {
        display: "grid",
        gridTemplateRows: "1fr 1fr 1fr",
        gap: "10px"
    }
};
