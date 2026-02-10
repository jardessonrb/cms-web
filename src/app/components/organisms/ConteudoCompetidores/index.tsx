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
import toast from "react-hot-toast";
import { Notify } from "@/app/lib/notify";
import { ExceptionDefault } from "@/app/types/default";

type ConteudoCompetidoresProps = {
    campeonatoId: string
}

export function ConteudoCompetidores({ campeonatoId }: ConteudoCompetidoresProps){
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [atletas, setAtletas] = useState<AtletaListagemDto[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(0);
    const [totalDePaginas, setTotalDePaginas] = useState(10);
    const [termoBusca, setTermoBusca] = useState<string | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [atletaForm, setAtletaForm] = useState(limpaAtletaForm() as AtletaForm);

    function mostraAtletas(atletas: AtletaListagemDto[]){
        console.log(atletas)

        setAtletas(atletas);
    }

    function limpaAtletaForm(){
        return {
            nome: undefined,
            apelido: undefined,
            campeonatoId,
            cidade: undefined,
            dataNascimento: undefined,
            graduacao: undefined, 
            responsavel: undefined,
            grupo: undefined
        }
    }

    async function cadastraAtleta(){
        try {
            const response = await AtletaService.criar(atletaForm);
            Notify.success("Competidor salvo com sucesso.")
            console.log({atletaForm, response});
            setIsModalOpen(false);
            setAtletaForm(limpaAtletaForm())
            await carregaDados();      
        } catch(error: any){
            if(error.response){
                const exception = error.response.data as ExceptionDefault;
                Notify.error(`Não foi possível salvar o competidor.${exception.erros[0]}`)
            }
        }
    }

    async function carregaDadosComFiltro(){
        console.log(termoBusca)
        AtletaService.listaAtletasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10, filtro: (!!termoBusca && termoBusca.length > 3 ? termoBusca : undefined)})
            .then((page) => {
            setPaginaAtual(page.number)
            setTotalDePaginas(page.totalPages)
            mostraAtletas(page.content)
            })
        .finally(() => setLoading(false));
    }

    async function carregaDados(){
        AtletaService.listaAtletasDoCampeonato(campeonatoId, {page: paginaAtual, size: 10})
        .then((page) => {
        setPaginaAtual(page.number)
        setTotalDePaginas(page.totalPages)
        mostraAtletas(page.content)
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
                        placeholder="Digite o nome ou apelido para buscar"
                        style={{width: "80%"}}
                        value={termoBusca}
                        onChange={setTermoBusca}
                    />
                    <Button mensagem="buscar" style={{height: "20px", marginLeft: 10}} act={carregaDadosComFiltro}/>
                </div>
                <Button mensagem="Cadastrar Novo Competidor" act={() => {
                    setIsModalOpen(true);
                    // Notify.info("Erro ao salvar o competidor", {
                    //     onClose: () => {
                    //         console.log("Fechou o toast de erro.")
                    //     },
                    //     duration: 2000
                    // })
                }}/>
            </div>
            <DataTable>
                <DataTableHeader columns="2fr 2fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
                    <div><strong>Número/Apelido</strong></div>
                    <div><strong>Responsável/Grupo</strong></div>
                    <div><strong>Graduação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody>
                    {atletas && atletas.length > 0 ? (
                        atletas.map((atleta) => (
                        <DataRow key={atleta.id} columns="2fr 2fr 1fr 1fr">
                            <DataCell>{atleta.apelido}</DataCell>
                            <DataCell>{atleta.responsavel} - {atleta.grupo}</DataCell>
                            <DataCell>{atleta.graduacao}</DataCell>
                            <DataCell style={{display: "flex", justifyContent: 'center'}}>
                            {/* <button onClick={() => router.push(`/atletas/${atleta.id}`)}>
                                Visualizar
                            </button> */}
                            <p>visualizar</p>
                            </DataCell>
                        </DataRow>
                    ))
                    ) : (<strong>Nenhum competidor encontrado</strong>)}
                </DataTableBody>
            </DataTable>
        
            <div style={styles.footer}>
                {atletas && atletas.length > 0 && 
                    <Pagination
                        totalPages={totalDePaginas}
                        currentPage={paginaAtual}
                        onPageChange={setPaginaAtual}
                    />
                }
            </div>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Competidor">
                <Input
                    placeholder="Nome"
                    value={atletaForm.nome}
                    onChange={v => Utils.updateField(setAtletaForm, "nome", v)}
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
                <Button mensagem="Cadastrar Atleta" act={cadastraAtleta} />
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
