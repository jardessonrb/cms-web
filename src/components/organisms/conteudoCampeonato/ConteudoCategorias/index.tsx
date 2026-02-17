"use client";

import { useEffect, useState } from "react";
import { Input } from "../../../atoms/Input";
import { Modal } from "../../../modecules/ModalBase";
import { Pagination } from "../../../modecules/Pagination";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "../../../Table";
import { useRouter } from "next/navigation";
import { Button } from "../../../atoms/Button";
import { Utils } from "@/services/utils";
import { Notify } from "@/lib/notify";
import { ExceptionDefault } from "@/types/default";
import { CategoriaService } from "@/services/categoria-service";
import { CategoriaDto, CategoriaForm } from "@/types/categoria";

type ConteudoCategoriasProps = {
    campeonatoId: string
}

export function ConteudoCategorias({ campeonatoId }: ConteudoCategoriasProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [categoriaForm, setCategoriaForm] = useState<CategoriaForm>(iniciaCategoriaForm() as CategoriaForm);


    async function carregaDadosComFiltro(){
        CategoriaService.listaCategoriasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3  || Utils.isNumeroValido(termoBusca) ? termoBusca : undefined)})
            .then((page) => {
            setPaginaAtual(page.number)
            setTotalDePaginas(page.totalPages)
            setCategorias(page.content)
            })
        .finally(() => setLoading(false));
    }

    function iniciaCategoriaForm(){
        return {
            categoriaId: undefined,
            nome: undefined,
            campeonatoId
        }
    }

    async function cadastraCategoria(){
        try {
            
            const response = await CategoriaService.criaCategoria(categoriaForm);
            Notify.success("Categoria criada com sucesso.")
            setIsModalOpen(false);
            setCategoriaForm(iniciaCategoriaForm())
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar cadastrar categoria")
            }

        }
    }

    async function atualizarCategoria(){
        try {

            if(!categoriaForm.categoriaId){
                Notify.error("É necessário ter o id da categoria para atualizar.")
                return;
            }
            
            const response = await CategoriaService.atualizarCategoria(categoriaForm.categoriaId , categoriaForm);
            Notify.success("Categoria atualizada com sucesso.")
            setIsModalOpen(false);
            setCategoriaForm(iniciaCategoriaForm())
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar cadastrar categoria")
            }

        }
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

    function setarCategoriaPorId(categoriaId: string){
        const categoriasPorId: CategoriaDto[] = categorias.filter(c => c.id === categoriaId)
        if(categoriasPorId.length > 0){
            const categoriaFormUpdate = {
                categoriaId: categoriasPorId[0].id,
                nome: categoriasPorId[0].nome,
                campeonatoId: categoriasPorId[0].campeonatoId
            } as CategoriaForm;

            setCategoriaForm(categoriaFormUpdate)
            setIsModalOpen(true)
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
            {categorias && categorias.length > 0 ? (
                <DataTable>
                <DataTableHeader columns="2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                    <div><strong>Categoria</strong></div>
                    <div><strong>Situação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody>
                    {categorias.map((categoria) => (
                        <DataRow key={categoria.id} columns="2fr 1fr 1fr">
                            <DataCell>{categoria.nome}</DataCell>
                            <DataCell>{categoria.situacao}</DataCell>
                            <DataCell style={{display: "flex", justifyContent: 'space-evenly'}}>
                                <Button mensagem="Visualizar" act={() => router.push(`/categorias/${categoria.id}`)} />
                                <Button mensagem="Editar" act={() => setarCategoriaPorId(categoria.id)} />
                            </DataCell>
                        </DataRow>
                    ))}
                </DataTableBody>
            </DataTable>
            ) : 
            (<DataTableMessageEmpty>Nenhuma categoria encontrada</DataTableMessageEmpty>)}
        
            <div style={styles.footer}>
                {categorias && categorias.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Categoria">
               <Input
                    placeholder="Nome da categoria"
                    value={categoriaForm.nome}
                    onChange={v => Utils.updateField(setCategoriaForm, "nome", v)}
                />
                {categoriaForm.categoriaId ? 
                    (<Button mensagem="Atualizar categoria" act={() => atualizarCategoria()}/> ) : 
                    (<Button mensagem="Cadastrar Categoria" act={() => cadastraCategoria()} />)
                }
                
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
