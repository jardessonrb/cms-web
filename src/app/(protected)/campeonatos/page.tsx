"use client";

import { useEffect, useRef, useState } from "react";
import { CampeonatoService} from "../../../services/campeonato-service";
// import { Table } from "../components/Table";
import { useRouter } from "next/navigation";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader, DataTableMessageEmpty } from "../../../components/Table";
import { Button } from "../../../components/atoms/Button";
import { Modal } from "../../../components/modecules/ModalBase";
import { Input } from "../../../components/atoms/Input";
import { Pagination } from "../../../components/modecules/Pagination";
import { CampeonatoDto, CampeonatoForm, getDescricaoSituacaoCampeonatoEnum } from "../../../types/campeonato";
import { Notify } from "@/lib/notify";
import { Utils } from "@/services/utils";
import { ExceptionDefault } from "@/types/default";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";
import { ButtonIcon } from "@/components/atoms/ButtonIcon";
import { Spinner } from "@/components/atoms/Spinner";

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<CampeonatoDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalDePaginas, setTotalDePaginas] = useState(2);
  const [campeonatoForm, setCampeonatoForm] = useState<CampeonatoForm>(limpaCampeonatoForm());
  const [isLoadingButton, setIsLoadingButton] = useState<boolean>(false);
  const requestIdRef = useRef(0);

  async function criaCampeonato(){
    if(!campeonatoForm?.nome || campeonatoForm.nome.trim().length == 0){
      Notify.error("É necessário informar um nome para o campeonato")
      return;
    }
    const resultado = await CampeonatoService.criaCampeonato(campeonatoForm);
    await carregaDados();
    setCampeonatoForm(limpaCampeonatoForm())
    setIsModalOpen(false);
  }

  async function atualizarCampeonato(){
    if(!campeonatoForm?.nome || campeonatoForm.nome.trim().length == 0){
      Notify.error("É necessário informar um nome para o campeonato")
      return;
    }

    if(!campeonatoForm.campeonatoId){
      Notify.error("É necessário informar o id para atualizar o campeonato")
      return;
    }

    try{

      setIsLoadingButton(true);
      const resultado = await CampeonatoService.atualizarCampeonato(campeonatoForm.campeonatoId, campeonatoForm);
      Notify.success("Campeonato atualizado com sucesso.");
      await carregaDados();
      setCampeonatoForm(limpaCampeonatoForm())
      setIsModalOpen(false);

    } catch(error: any){
        if(error.response){
            const exception = error.response.data as ExceptionDefault;
            Notify.error(exception.erros[0])
        }else{
            Notify.error("Erro desconhecido ao tentar atualizar campeonato")
        }
    } finally {
      setIsLoadingButton(false);
    }


  }

  function limpaCampeonatoForm(): CampeonatoForm{
    return {
      nome: undefined,
      campeonatoId: undefined
    }
  }

  async function carregaDados(){
    const requestId = ++requestIdRef.current;
    setLoading(true);
    try{
      const paginaCampeonatos = await CampeonatoService.listar({page: paginaAtual, size: 10});
      setTotalDePaginas(paginaCampeonatos.totalPages)
      setCampeonatos(paginaCampeonatos.content)

    } catch(error: any){
        if(error.response){
            const exception = error.response.data as ExceptionDefault;
            Notify.error(exception.erros[0])
        }else{
            Notify.error("Erro desconhecido ao tentar listar competidores.")
        }
    }finally {
        if (requestId === requestIdRef.current) {
            setLoading(false);
        }

        setLoading(false)
    }
  }

  function setarCampeonatoPorIdParaAtualizacao(campeonatoId: string){
    const campeonatosPorId: CampeonatoDto[] = campeonatos.filter(c => c.id === campeonatoId);
    if(campeonatosPorId.length > 0){
        const campeonatoFormUpdate = {
            nome: campeonatosPorId[0].nome,
            campeonatoId: campeonatosPorId[0].id
        } as CampeonatoForm;

        setCampeonatoForm(campeonatoFormUpdate)
        setIsModalOpen(true)
    }
  }

  function definirCorConformeSituacao(situacao: string) : SituacaoType {
    if(situacao === "Ativo" || situacao === "Criado"){
      return "SUCCESS"
    }

    if(situacao === "Finalizado"){
      return "CONFIRM"
    }

    return "DANGER"
  }

  useEffect(() => {
    carregaDados();
  }, [paginaAtual]);

  return (
    <main style={styles.main}>
      <div style={styles.top}>
        <h1>Campeonatos</h1>
        <Button mensagem="Criar Campeonato" act={() => setIsModalOpen(true)}/>
      </div>
      {campeonatos && campeonatos.length > 0 ? (
        <DataTable>
          <DataTableHeader columns="3fr 1fr 1fr" style={{marginTop: "10px", marginBottom: "20px"}}>
            <div><strong>Nome</strong></div>
            <div><strong>Situação</strong></div>
            <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
          </DataTableHeader>

          <DataTableBody>
            {campeonatos.map((campeonatoDto) => (
              <DataRow key={campeonatoDto.id} columns="3fr 1fr 1fr">
                <DataCell>{campeonatoDto.nome}</DataCell>
                <DataCell>
                  <SituacaoEstilizada children={getDescricaoSituacaoCampeonatoEnum(campeonatoDto.situacao)} funcType={situacao => definirCorConformeSituacao(situacao)}/>
                </DataCell>
                <DataCell style={{display: "flex", justifyContent: 'space-evenly'}}>
                    <ButtonIcon type="OPEN" mensagem="Visualizar" act={() => router.push(`/campeonatos/${campeonatoDto.id}`)} />
                    <ButtonIcon type="UPDATE" mensagem="Atualizar" act={() => setarCampeonatoPorIdParaAtualizacao(campeonatoDto.id)}/>
                </DataCell>
              </DataRow>
            ))}
          </DataTableBody>
        </DataTable>
      ) : (
         <DataTableMessageEmpty>
          {campeonatos && campeonatos.length == 0 && !loading ? (
            <span>Nenhum campeonato encontrado</span>
          ) : (
            <>
              <Spinner style={{width: "50px", height: "50px"}} colorBackground="var(--color-confirm)"/>
              <span style={{color: "var(--color-confirm)", fontWeight: "bold"}}>Carregando</span>
            </>

          )}
          </DataTableMessageEmpty>
      )}
      
      {campeonatos && campeonatos.length > 0 && 
        <div style={styles.footer}>
          <Pagination
            totalPages={totalDePaginas}
            currentPage={paginaAtual}
            onPageChange={setPaginaAtual}
          />
        </div>
      }
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={campeonatoForm.campeonatoId ? "Atualizar Campeonato" : "Novo Campeonato"}>
        <Input
          placeholder="Nome do campeonato"
          value={campeonatoForm.nome}
          onChange={valor => Utils.updateField(setCampeonatoForm, "nome", valor)}
        />
        {campeonatoForm.campeonatoId ? (
          <Button mensagem="Atualizar campeonato" isLoading={isLoadingButton} act={() => atualizarCampeonato()} />
        ) : (
          <Button mensagem="Criar campeonato" isLoading={isLoadingButton} act={() => criaCampeonato()} />
        )}
        
      </Modal>

    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    backgroundColor: "var(--color-bg-light)",
    minHeight: "100vh",
    width: "95%",
    paddingLeft: 10,
    paddingRight: 10
  },
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
