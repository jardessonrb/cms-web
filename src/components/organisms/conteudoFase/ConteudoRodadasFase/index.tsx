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
import { CriteriorEntradaEnum, FaseDto } from "@/types/fase";
import { getDescricaoSituacaoRodadaEnum, getDescricaoTipoRodadaEnum, RodadaDto } from "@/types/roda";
import { RodadaService } from "@/services/rodada-service";
import { ListagemDisputa } from "../ListagemDisputa";
import { CardRegistroDeNotas } from "../CardRegistroDeNotas";
import { AtletaNotasForm, DisputaDto, NotaForm, RegistroDeNotasForm, TipoDisputaEnum } from "@/types/disputa";
import { DisputaService } from "@/services/disputa-service";
import { JuradoService } from "@/services/jurado-service";

type ConteudoFaseCategoriaProps = {
    categoriaId: string
    faseId: string
    campeonatoId: string
}

export function ConteudoRodasFase({ categoriaId, faseId, campeonatoId }: ConteudoFaseCategoriaProps){
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
    const [isModalRegistroNotaOpen, setIsModalRegistroNotaOpen] = useState<boolean>(false);
    const [disputaAtualParaRegistroNota, setDisputaAtualParaRegistroNota] = useState<DisputaDto>()
    const [registroAtleta1, setRegistroAtleta1] = useState<AtletaNotasForm | null>()
    const [registroAtleta2, setRegistroAtleta2] = useState<AtletaNotasForm | null>()
    const [reloadKeyChildren, setReloadKeyChildren] = useState<number>(0)

    const [jurado, setJurado] = useState<SelectOption>();
    const [jurados, setJurados] = useState<SelectOption[]>([]);

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

    async function abrirModalDeRegistroDeNota(disputaId: string){
        try {
            const disputaResponse = await DisputaService.buscaDisputaPorId(disputaId);
            setDisputaAtualParaRegistroNota(disputaResponse);
            setIsModalRegistroNotaOpen(true)

            const juradosDasNotas = disputaResponse?.registrosDisputa[0].notas;
            if(juradosDasNotas && juradosDasNotas.length == 3){
                const juradosParaSelect: SelectOption[] = juradosDasNotas.map(jurado => {
                    return {id: jurado.id, label: jurado.juradoNome} as SelectOption
                })

                setJurados(juradosParaSelect)
            }
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
    }

    async function salvarNotas(){
        if(jurados.length != 3){
            Notify.error("Todos os 3 jurados devem estar selecionados.")
            return;
        }

        const registros = [registroAtleta1, registroAtleta2].filter(reg => reg != undefined);
        for(let i = 0; i < registros.length; i++){
            for(let j = 0; j < registros[i].notas.length; j++){
                registros[i].notas[j].juradoId = jurados[j].id
            }
        }

        if(disputaAtualParaRegistroNota?.id == undefined){
            Notify.error("É necessário informar a disputa que deve haver registro de notas.")
            return;
        }

        const body = {atletas: registros} as RegistroDeNotasForm

        try {
            const resposta = await DisputaService.registrarNotas(disputaAtualParaRegistroNota.id, body);
            Notify.success("Notas registradas com sucesso.")
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
                Notify.error("Erro desconhecido ao tentar registrar as notas.")
            }

        }
    }

    function closeModalDeRegistroNotas(){
        setIsModalRegistroNotaOpen(false); 
        setDisputaAtualParaRegistroNota(undefined)
        setRegistroAtleta1(null)
        setRegistroAtleta2(null);
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
            {rodadas && rodadas.length > 0 ? (
                <DataTable>
                <DataTableHeader columns="2fr 1fr 2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
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
                            <DataRow key={rodada.id} columns="2fr 1fr 2fr 1fr 1fr" 
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
                                <DataCell>{getDescricaoSituacaoRodadaEnum(rodada.situacao)}</DataCell>
                                <DataCell style={{display: "flex", flexDirection: 'column', justifyContent: 'space-between'}}>
                                    <button onClick={() => ajusteRodadasExpandidas(rodada.id)}>
                                    {isMostraConteudoExpandidoLinha ? (<p>Esconder</p>) : (<p>Ver</p>)}
                                    </button>
                                </DataCell>
                            </DataRow>
                        )
                    })}
                </DataTableBody>
            </DataTable>
            ) : (<DataTableMessageEmpty>Nenhuma rodada encontrada</DataTableMessageEmpty>)}
            
        
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

            <Modal open={isModalRegistroNotaOpen} onClose={() => closeModalDeRegistroNotas()} modalStyle={{maxWidth: "900px"}} title="Registrar Notas da Disputa">
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
                                value={jurados.length == 3 ? jurados[0] : {id: "", label: ""}}
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
                                value={jurados.length == 3 ? jurados[1] : {id: "", label: ""}}
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
                                value={jurados.length == 3 ? jurados[2] : {id: "", label: ""}}
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
                        {disputaAtualParaRegistroNota?.tipoDisputa.toUpperCase() === TipoDisputaEnum.DUPLA.toUpperCase() ? (
                            <CardRegistroDeNotas
                                registro={disputaAtualParaRegistroNota?.registrosDisputa[1]}
                                onChangeNotas={(atletaId, notas) => setRegistroAtleta2({atletaId, notas})}
                                campeonatoId={campeonatoId}
                            />
                        ) : (<div>Disputa do tipo individual só permite um competidor</div>)}
                    </div>                
                </div>
                <Button style={{width: "50%", alignSelf: 'center'}} mensagem="Salvar Notas" act={salvarNotas} />
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
