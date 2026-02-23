import { Button } from "@/components/atoms/Button";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";
import { Spinner } from "@/components/atoms/Spinner";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "@/components/Table";
import { Notify } from "@/lib/notify";
import { DisputaService } from "@/services/disputa-service";
import { RodadaService } from "@/services/rodada-service";
import { Utils } from "@/services/utils";
import { ExceptionDefault } from "@/types/default";
import { DisputaDto, getDescricaoSituacaoDisputaEnum, getDescricaoTipoDisputaEnum, RegistroDisputaDto } from "@/types/disputa";
import { useEffect, useState } from "react";

type ListagemDisputaProps = {
    faseId: string
    rodadaId: string
    act: (disputaId: string) => void
}

type ExtracaoNomesDisputa = {
    texto1: string
    texto2: string
}

function definirCorConformeSituacao(situacao: string) : SituacaoType {
    if(situacao === "Pendente"){
        return "ALERT"
    }

    if(situacao === "Concluída"){
        return "SUCCESS"
    }

    return "DANGER"
}

export function ListagemDisputa({ faseId, rodadaId, act }: ListagemDisputaProps){
    const [disputas, setDispustas] = useState<DisputaDto[]>([])
    const [loading, setLoading] = useState(true);
    const DISPUTA_CONCLUIDA = "CONCLUIDA";

    function extraiNomeDisputa(disputa: DisputaDto): ExtracaoNomesDisputa {
        let registroDisputa1: RegistroDisputaDto = disputa.registrosDisputa[0]
        let registroDisputa2: RegistroDisputaDto | null = null; 

        if(disputa.registrosDisputa.length > 1){
            registroDisputa2 = disputa.registrosDisputa[1]
        }
        
        const parteNomeDisputa1 = `${Utils.uniNomeAndApelidoAndNumero(registroDisputa1.nomeAtleta, registroDisputa1.apelidoAtleta, registroDisputa1.numeroAtleta)}`;
        const parteNomeDisputa2 = `${ registroDisputa2 ? Utils.uniNomeAndApelidoAndNumero(registroDisputa2.nomeAtleta, registroDisputa2.apelidoAtleta, registroDisputa2.numeroAtleta) : ""}`;
        return {texto1: parteNomeDisputa1, texto2: `${parteNomeDisputa2.length > 0 ? parteNomeDisputa2 : ""}`} 
    }

    async function carregaDados() {
        try {
            const disputasResponse = await DisputaService.buscaDisputasPorRodadaId(rodadaId, {page: 0, size: 0});
            setDispustas(disputasResponse);     
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`${exception.erros[0]}`)
            }else{
                Notify.error("Erro desconhecido ao tentar buscar as disputas da rodada")
            }
        }
    }

    useEffect(() => {
        carregaDados();
    }, []);

    return (
        <div style={styles.container}>
            {disputas && disputas.length > 0 ? (
                <DataTable style={{width: "100%"}}>
                    <DataTableHeader columns="3fr 2fr 1fr 1fr" style={styles.dataTableHeader}>
                        <div><strong>Competidores</strong></div>
                        <div><strong>Tipo de disputa</strong></div>
                        <div><strong>Situação</strong></div>
                        <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                    </DataTableHeader>
        
                    <DataTableBody maxHeight={"350px"} style={{paddingRight: "10px"}}>
                        {disputas.map((disputa) => {
                            const textos = extraiNomeDisputa(disputa);
                            return (
                                <DataRow key={disputa.id} columns="3fr 2fr 1fr 1fr" style={{backgroundColor: "var(--color-bg-light)"}}>
                                    <DataCell>
                                        <strong>{textos.texto1}</strong> 
                                        <span style={{marginLeft: "4px", marginRight: "4px"}}>{textos.texto2.length > 0 ? "vs" : ""}</span> 
                                        <strong>{textos.texto2}</strong>
                                    </DataCell>
                                    <DataCell>{getDescricaoTipoDisputaEnum(disputa.tipoDisputa)}</DataCell>
                                    <DataCell>
                                        <SituacaoEstilizada children={getDescricaoSituacaoDisputaEnum(disputa.situacao)} funcType={situacao => definirCorConformeSituacao(situacao)}/>
                                        
                                    </DataCell>
                                    <DataCell style={{display: "flex", flexDirection: 'column', justifyContent: 'space-between'}}>
                                        {disputa.situacao.toUpperCase() === DISPUTA_CONCLUIDA ? (
                                            <ButtonIcon mensagem="Atualizar notas" type="UPDATE" act={() => act(disputa.id)}/>
                                        ) : (
                                            <ButtonIcon mensagem="Registrar notas" type="REGISTER" act={() => act(disputa.id)}/>
                                        )}
                                        {/* <Button mensagem={disputa.situacao.toUpperCase() === "CONCLUIDA" ? "Atualizar Notas" : "Adicionar Notas"} act={() => act(disputa.id)}/> */}
                                    </DataCell>
                                </DataRow>
                            )
                        })}
                    </DataTableBody>
                </DataTable>
            ) : (
                <DataTableMessageEmpty>
                    {disputas && disputas.length == 0 && !loading ? (
                    <span>Nenhuma disputa encontrada para a rodada</span>
                    ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>
        
                    )}
                </DataTableMessageEmpty>
            )}

            
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: '100%',
        // backgroundColor: "var(--color-bg-light)",
        // backgroundColor: "#d4d4",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        // padding: "10px 0px",
        borderBottomRightRadius: "10px",
        borderBottomLeftRadius: "10px",
    },
    dataTableHeader: {
        alignItems: "center",
        minHeight: "80px",
        marginTop: "10px",
        padding: "5px",
        marginRight: "10px",
        backgroundColor: "var(--color-bg-light)",
        borderRadius: "10px"
    }
};