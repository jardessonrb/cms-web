"use client";

import { useEffect, useState } from "react";
import { Input } from "../../atoms/Input";
import { Modal } from "../../modecules/ModalBase";
import { Pagination } from "../../modecules/Pagination";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader } from "../../Table";
import { AtletaForm, AtletaListagemDto } from "@/app/types/atleta";
import { useRouter } from "next/navigation";
import { AtletaService } from "@/app/services/atleta-service";
import { Button } from "../../atoms/Button";
import { Utils } from "@/app/services/utils";
import { Notify } from "@/app/lib/notify";
import { ExceptionDefault } from "@/app/types/default";
import { AsyncSelect } from "../../atoms/AsyncSelect";
import { CategoriaService } from "@/app/services/categoria-service";
import { CategoriaDto } from "@/app/types/categoria";

type ConteudoCompetidoresProps = {
    campeonatoId: string
}

export type SelectOption = {
  id: string;
  label: string;
};

export function ConteudoCategorias({ campeonatoId }: ConteudoCompetidoresProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);


    async function carregaDadosComFiltro(){
        console.log(termoBusca)
        CategoriaService.listaCategoriasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 ? termoBusca : undefined)})
            .then((page) => {
            setPaginaAtual(page.number)
            setTotalDePaginas(page.totalPages)
            setCategorias(page.content)
            })
        .finally(() => setLoading(false));
    }

    async function carregaDados(){
        CategoriaService.listaCategoriasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10})
        .then((page) => {
        setPaginaAtual(page.number)
        setTotalDePaginas(page.totalPages)
        setCategorias(page.content)
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
                        placeholder="Digite o nome da categoria"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <Button mensagem="Criar nova categoria" act={() => {
                    setIsModalOpen(true);
                }}/>
            </div>
            <DataTable>
                <DataTableHeader columns="2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                    <div><strong>Categoria</strong></div>
                    <div><strong>Situação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody>
                    {categorias && categorias.length > 0 ? (
                        categorias.map((categoria) => (
                        <DataRow key={categoria.id} columns="2fr 1fr 1fr">
                            <DataCell>{categoria.nome}</DataCell>
                            <DataCell>{categoria.situacao}</DataCell>
                            <DataCell style={{display: "flex", justifyContent: 'center'}}>
                            {/* <button onClick={() => router.push(`/atletas/${atleta.id}`)}>
                                Visualizar
                            </button> */}
                            <p>visualizar</p>
                            </DataCell>
                        </DataRow>
                    ))
                    ) : (<strong>Nenhuma categoria encontrada</strong>)}
                </DataTableBody>
            </DataTable>
        
            <div style={styles.footer}>
                {categorias && categorias.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Competidor">
               
                <Button mensagem="Cadastrar Categoria" act={() => () => {}} />
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
