"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../atoms/Input";
import { Modal } from "../../../modecules/ModalBase";
import { Pagination } from "../../../modecules/Pagination";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "../../../Table";
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

type ConteudoCompetidoresProps = {
    categoriaId: string
    campeonatoId: string
}


export function ConteudoCompetidoresCategoria({ categoriaId, campeonatoId }: ConteudoCompetidoresProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [atletas, setAtletas] = useState<AtletaListagemDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [inscricaoAtletaCategoria, setInscricaoAtletaCategoria] = useState(limpaAtletaForm() as InscricaoAtletaCategoriaForm);
    const [competidor, setCompetidor] = useState<SelectOption | null>(null);

    function mostraAtletas(atletas: AtletaListagemDto[]){
        setAtletas(atletas);
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
        AtletaService.listaAtletasDaCategoria(categoriaId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 ? termoBusca : undefined)})
            .then((page) => {
                setPaginaAtual(page.number)
                setTotalDePaginas(page.totalPages)
                mostraAtletas(page.content)
            })
            .finally(() => setLoading(false));
    }

    async function carregaDados(){
        AtletaService.listaAtletasDaCategoria(categoriaId, {page: paginaAtual, size: 10})
            .then((page) => {
                setPaginaAtual(page.number)
                setTotalDePaginas(page.totalPages)
                mostraAtletas(page.content)
            })
            .finally(() => setLoading(false));

        console.log(atletas)
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
                <Button mensagem="Inscrever Competidor na Categoria" act={() => {
                    setIsModalOpen(true);
                }}/>
            </div>
            {atletas && atletas.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="2fr 2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                        <div><strong>Número/Apelido</strong></div>
                        <div><strong>Responsável/Grupo</strong></div>
                        <div><strong>Graduação</strong></div>
                        <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                    </DataTableHeader>
        
                    <DataTableBody>
                        {atletas.map((atleta) => (
                            <DataRow key={atleta.id} columns="2fr 2fr 1fr 1fr">
                                <DataCell>{atleta.numero} - {atleta.apelido}</DataCell>
                                <DataCell>{atleta.responsavel} - {atleta.grupo}</DataCell>
                                <DataCell>{atleta.graduacao}</DataCell>
                                <DataCell style={{display: "flex", justifyContent: 'center'}}>
                                {/* <button onClick={() => router.push(`/atletas/${atleta.id}`)}>
                                    Visualizar
                                </button> */}
                                <p>visualizar</p>
                                </DataCell>
                            </DataRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            ) : (<DataTableMessageEmpty>Nenhum competidor encontrado</DataTableMessageEmpty>)}
            
        
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
                <Button mensagem="Inscrever Atleta" act={inscreveAtletaEmCategoria} />
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
