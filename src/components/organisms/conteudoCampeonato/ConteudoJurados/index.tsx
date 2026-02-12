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
import { JuradoDto, JuradoForm } from "@/types/jurado";
import { JuradoService } from "@/services/jurado-service";
import { Page } from "@/types/page";

type ConteudoJuradosProps = {
    campeonatoId: string
}

export type SelectOption = {
  id: string;
  label: string;
};

export function ConteudoJurados({ campeonatoId }: ConteudoJuradosProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [jurados, setJurados] = useState<JuradoDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [juradoForm, setJuradoForm] = useState<JuradoForm>(iniciaJuradoForm() as JuradoForm);


    async function carregaDadosComFiltro(){
         try {
            const juradoResponse: Page<JuradoDto> = await JuradoService.listaJuradosDoCampeonato(campeonatoId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length >= 3 ? termoBusca : undefined)})
            setPaginaAtual(juradoResponse.number)
            setTotalDePaginas(juradoResponse.totalPages)
            setJurados(juradoResponse.content)
                  
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao listar jurados do campeonato.")
            }
        }
    }

    function iniciaJuradoForm() : JuradoForm {
        return {
            nome: undefined,
            apelido: undefined,
            grupo: undefined,
            campeonatoId
        }
    }

    async function cadastraJurado(){
        try {
            const response: JuradoDto = await JuradoService.criaJurado(juradoForm);
            Notify.success("Jurado criado com sucesso.")
            setIsModalOpen(false);
            setJuradoForm(iniciaJuradoForm())
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(exception.erros[0])
            }else{
                Notify.error("Erro desconhecido ao tentar cadastrar jurado")
            }
        }
    }

    async function carregaDados(){
        JuradoService.listaJuradosDoCampeonato(campeonatoId, {page: paginaAtual, size: 10})
        .then((page) => {
            setPaginaAtual(page.number)
            setTotalDePaginas(page.totalPages)
            setJurados(page.content)
        })
        .finally(() => setLoading(false));

        console.log(jurados)
    }

    useEffect(() => {
        carregaDados();
    }, [paginaAtual, termoBusca]);

    return (
        <div>
            <div style={styles.top}>
                <div style={{width: "25%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <Input 
                        placeholder="Digite o nome ou apelido do jurado"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <Button mensagem="Cadastrar novo jurado" act={() => {
                    setIsModalOpen(true);
                }}/>
            </div>
            {jurados && jurados.length > 0 ? (
                <DataTable>
                    <DataTableHeader columns="2fr 1fr 2fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                        <div><strong>Nome</strong></div>
                        <div><strong>Apelido</strong></div>
                        <div><strong>Grupo/Escola</strong></div>
                        <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                    </DataTableHeader>
            
                    <DataTableBody>
                        {jurados.map((jurado) => (
                            <DataRow key={jurado.id} columns="2fr 1fr 2fr 1fr">
                                <DataCell>{jurado.nome}</DataCell>
                                <DataCell>{jurado.apelido}</DataCell>
                                <DataCell>{jurado.grupo}</DataCell>
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
            ) : (<DataTableMessageEmpty>Nenhum jurado encontrado</DataTableMessageEmpty>)}
        
            <div style={styles.footer}>
                {jurados && jurados.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Jurado">
               <Input
                    placeholder="Nome do jurado"
                    value={juradoForm.nome}
                    onChange={v => Utils.updateField(setJuradoForm, "nome", v)}
                />
                <Input
                    placeholder="Apelido do jurado"
                    value={juradoForm.apelido}
                    onChange={v => Utils.updateField(setJuradoForm, "apelido", v)}
                />
                <Input
                    placeholder="Nome grupo/escola"
                    value={juradoForm.grupo}
                    onChange={v => Utils.updateField(setJuradoForm, "grupo", v)}
                />
                <Button mensagem="Cadastrar jurado" act={cadastraJurado} />
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
