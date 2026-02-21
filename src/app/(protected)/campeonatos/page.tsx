"use client";

import { useEffect, useState } from "react";
import { CampeonatoService} from "../../../services/campeonato-service";
// import { Table } from "../components/Table";
import { useRouter } from "next/navigation";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader } from "../../../components/Table";
import { Button } from "../../../components/atoms/Button";
import { Modal } from "../../../components/modecules/ModalBase";
import { Input } from "../../../components/atoms/Input";
import { Pagination } from "../../../components/modecules/Pagination";
import { CampeonatoDto, CampeonatoForm, getDescricaoSituacaoCampeonatoEnum } from "../../../types/campeonato";
import { Notify } from "@/lib/notify";
import { Utils } from "@/services/utils";
import { ExceptionDefault } from "@/types/default";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<CampeonatoDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalDePaginas, setTotalDePaginas] = useState(2);
  const [campeonatoForm, setCampeonatoForm] = useState<CampeonatoForm>(limpaCampeonatoForm());

  function mostraCampeonato(campeonatos: CampeonatoDto[]){
    setCampeonatos(campeonatos)
  }

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

      const resultado = await CampeonatoService.atualizarCampeonato(campeonatoForm.campeonatoId, campeonatoForm);
      Notify.success("Campeonato atualizado com sucesso.");
      await carregaDados();
      setCampeonatoForm(limpaCampeonatoForm())
      setIsModalOpen(false);

    }catch(error: any){
        if(error.response){
            const exception = error.response.data as ExceptionDefault;
            Notify.error(exception.erros[0])
        }else{
            Notify.error("Erro desconhecido ao tentar atualizar campeonato")
        }

    }

  }

  function limpaCampeonatoForm(): CampeonatoForm{
    return {
      nome: undefined,
      campeonatoId: undefined
    }
  }

  async function carregaDados(){
     CampeonatoService.listar({page: paginaAtual, size: 10})
      .then((page) => {
        setPaginaAtual(page.number)
        setTotalDePaginas(page.totalPages)
        mostraCampeonato(page.content)
      })
      .finally(() => setLoading(false));
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

  if (loading) return <p style={{ padding: 24 }}>Carregando...</p>;

  return (
    <main style={styles.main}>
      <div style={styles.top}>
        <h1>Campeonatos</h1>
        <Button mensagem="Criar Campeonato" act={() => setIsModalOpen(true)}/>
      </div>
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
                {/* {getDescricaoSituacaoCampeonatoEnum(campeonatoDto.situacao)} */}
              </DataCell>
              <DataCell style={{display: "flex", justifyContent: 'space-evenly'}}>
                  <Button mensagem="Visualizar" act={() => router.push(`/campeonatos/${campeonatoDto.id}`)} />
                  <Button mensagem="Editar" act={() => setarCampeonatoPorIdParaAtualizacao(campeonatoDto.id)} />
              </DataCell>
            </DataRow>
          ))}
        </DataTableBody>
      </DataTable>

      <div style={styles.footer}>
        <Pagination
          totalPages={totalDePaginas}
          currentPage={paginaAtual}
          onPageChange={setPaginaAtual}
        />
      </div>
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title={campeonatoForm.campeonatoId ? "Atualizar Campeonato" : "Novo Campeonato"}>
        <Input
          placeholder="Nome do campeonato"
          value={campeonatoForm.nome}
          onChange={valor => Utils.updateField(setCampeonatoForm, "nome", valor)}
        />
        {campeonatoForm.campeonatoId ? (
          <Button mensagem="Atualizar campeonato" act={() => atualizarCampeonato()} />
        ) : (
          <Button mensagem="Criar campeonato" act={() => criaCampeonato()} />
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
