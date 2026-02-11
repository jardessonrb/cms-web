"use client";

import { useEffect, useState } from "react";
import { CampeonatoService} from "../services/campeonato-service";
// import { Table } from "../components/Table";
import { useRouter } from "next/navigation";
import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader } from "../components/Table";
import { Button } from "../components/atoms/Button";
import { Modal } from "../components/modecules/ModalBase";
import { Input } from "../components/atoms/Input";
import { Pagination } from "../components/modecules/Pagination";
import { CampeonatoDto } from "../types/campeonato";

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<CampeonatoDto[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [paginaAtual, setPaginaAtual] = useState(0);
  const [totalDePaginas, setTotalDePaginas] = useState(2);

  const [nomeCampeonato, setNomeCampeonato] = useState<string | undefined>(undefined);

  function mostraCampeonato(campeonatos: CampeonatoDto[]){
    setCampeonatos(campeonatos)
  }

  async function criaCampeonato(){
    const resultado = await CampeonatoService.criaCampeonato({nome: nomeCampeonato});
    await carregaDados();
    setNomeCampeonato(undefined)
    setIsModalOpen(false);
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
          {campeonatos.map((campeonatoRow) => (
            <DataRow key={campeonatoRow.id} columns="3fr 1fr 1fr">
              <DataCell>{campeonatoRow.nome}</DataCell>
              <DataCell>{campeonatoRow.situacao}</DataCell>
              <DataCell style={{display: "flex", justifyContent: 'center'}}>
                <Button mensagem="Visualizar" act={() => router.push(`/campeonatos/${campeonatoRow.id}`)} />
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
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Novo Campeonato">
        <Input
          placeholder="Nome do campeonato"
          value={nomeCampeonato}
          onChange={setNomeCampeonato}
        />
        <Button mensagem="Criar campeonato" act={() => criaCampeonato()} />
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
