"use client";

import { useEffect, useState } from "react";
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
import { InscricaoAtletaCategoriaForm } from "@/types/inscricao-atleta-categoria";
import { SituacaoEstilizada } from "@/components/atoms/SituacaoEstilizada";
import { Spinner } from "@/components/atoms/Spinner";

type ConteudoCompetidoresProps = {
    faseId: string
    campeonatoId: string
}


export function ConteudoCompetidoresFase({ faseId, campeonatoId }: ConteudoCompetidoresProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isLoadingBuscaAtletas, setIsLoadingBuscaAtletas] = useState(false);
    const [atletas, setAtletas] = useState<AtletaListagemDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [competidor, setCompetidor] = useState<SelectOption | null>(null);

    function mostraAtletas(atletas: AtletaListagemDto[]){
        setAtletas(atletas);
    }

    async function carregaDadosComFiltro(){
        try{
            setIsLoadingBuscaAtletas(true)
            const paginaAtletasFase = await AtletaService.listaAtletaPorFase(faseId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 || Utils.isNumeroValido(termoBusca) ? termoBusca : undefined)});
            setTotalDePaginas(paginaAtletasFase.totalPages)
            setAtletas(paginaAtletasFase.content)

        }catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar buscar os competidores da fase")
            }
        } finally {
            setIsLoadingBuscaAtletas(false);
        }
    }

    async function carregaDados(){
        try{
            setLoading(true)
            const paginaAtletasFase = await AtletaService.listaAtletaPorFase(faseId, {page: paginaAtual, size: 10});
            setTotalDePaginas(paginaAtletasFase.totalPages)
            setAtletas(paginaAtletasFase.content)

        }catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar listar os competidores da fase")
            }
        } finally {
            setLoading(false);
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
                    <Button mensagem="buscar" isLoading={isLoadingBuscaAtletas} style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                {/* <Button mensagem="Inscrever Competidor na Categoria" act={() => {
                    setIsModalOpen(true);
                }}/> */}
            </div>
            {atletas && atletas.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="2fr 2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                        <div><strong>Número/Apelido/Nome</strong></div>
                        <div><strong>Responsável/Grupo</strong></div>
                        <div><strong>Graduação</strong></div>
                        <div><strong>Situação</strong></div>
                        {/* <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div> */}
                    </DataTableHeader>
        
                    <DataTableBody>
                        {atletas.map((atleta) => (
                            <DataRow key={atleta.id} columns="2fr 2fr 1fr 1fr">
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
                                <DataCell>
                                    <SituacaoEstilizada children={getDescricaoSituacaoAtletaEnum(atleta.situacao)} funcType={situacao => Utils.definirCorConformeSituacaoAtleta(situacao)}/>
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
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)"/>
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
            <Modal open={isModalOpen} onClose={() => {setIsModalOpen(false), setCompetidor(null)}} title="Inscrever Competidor">
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
