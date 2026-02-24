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
import { CategoriaDto, CategoriaForm, getDescricaoSituacaoCategoriaEnum } from "@/types/categoria";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";
import { Spinner } from "@/components/atoms/Spinner";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";

type ConteudoCategoriasProps = {
    campeonatoId: string
}

export function ConteudoCategorias({ campeonatoId }: ConteudoCategoriasProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [isLoadingCreateUpdateCategoria, setIsLoadingCreateUpdateCategoria] = useState(false);
    const [isLoadingBuscaCategoria, setIsLoadingBuscaCategoria] = useState(false);
    const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [categoriaForm, setCategoriaForm] = useState<CategoriaForm>(iniciaCategoriaForm() as CategoriaForm);


    async function carregaDadosComFiltro(){
        setIsLoadingBuscaCategoria(true);
        try{
            const paginaCategorias = await CategoriaService.listaCategoriasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3  || Utils.isNumeroValido(termoBusca) ? termoBusca : undefined)});
            setTotalDePaginas(paginaCategorias.totalPages);
            setCategorias(paginaCategorias.content);
    
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar listar categorias.")
            }
        }finally {
            setIsLoadingBuscaCategoria(false)
        }
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
            
            setIsLoadingCreateUpdateCategoria(true);
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
        } finally {
            setIsLoadingCreateUpdateCategoria(false);
        }
    }

    async function atualizarCategoria(){
        try {

            if(!categoriaForm.categoriaId){
                Notify.error("É necessário ter o id da categoria para atualizar.")
                return;
            }
            
            setIsLoadingCreateUpdateCategoria(true);
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
        } finally {
            setIsLoadingCreateUpdateCategoria(false);
        }
    }


    async function carregaDados(){
        setLoading(true);
        try{
            const paginaCategorias = await CategoriaService.listaCategoriasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10});
            setTotalDePaginas(paginaCategorias.totalPages);
            setCategorias(paginaCategorias.content);
    
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar listar categorias.")
            }
        }finally {
            setLoading(false)
        }
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
                        placeholder="Digite o nome da categoria"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" isLoading={isLoadingBuscaCategoria} style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <Button mensagem="Criar nova categoria" act={() => {
                    setIsModalOpen(true);
                }}/>
            </div>
            {categorias && categorias.length > 0 ? (
                <DataTable>
                <DataTableHeader columns="2fr 2fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                    <div><strong>Categoria</strong></div>
                    <div><strong>Situação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody>
                    {categorias.map((categoria) => (
                        <DataRow key={categoria.id} columns="2fr 2fr 1fr">
                            <DataCell>
                                <span style={{fontWeight: "bold", textTransform: "uppercase"}}>{categoria.nome}</span>
                            </DataCell>
                            <DataCell>
                                <SituacaoEstilizada children={getDescricaoSituacaoCategoriaEnum(categoria.situacao)} funcType={situacao => definirCorConformeSituacao(situacao)} />
                            </DataCell>
                            <DataCell style={{display: "flex", justifyContent: 'space-evenly'}}>
                                <ButtonIcon mensagem="Visualizar" type="OPEN" act={() => router.push(`/categorias/${categoria.id}`)} />
                                <ButtonIcon mensagem="Editar" type="UPDATE" act={() => setarCategoriaPorId(categoria.id)} />
                            </DataCell>
                        </DataRow>
                    ))}
                </DataTableBody>
            </DataTable>
            ) : 
            (
                <DataTableMessageEmpty>
                    {categorias && categorias.length == 0 && !loading ? (
                        <span>Nenhuma categoria encontrado</span>
                    ) : (
                    <>
                        <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)" colorBorderTop="var(--color-bg)"/>
                        <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
                    </>

                    )}
                </DataTableMessageEmpty>
            )}
        
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
                    (<Button mensagem="Atualizar categoria" isLoading={isLoadingCreateUpdateCategoria} act={() => atualizarCategoria()}/> ) : 
                    (<Button mensagem="Cadastrar Categoria" isLoading={isLoadingCreateUpdateCategoria} act={() => cadastraCategoria()} />)
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
