"use client";

import { useEffect, useState } from "react";
import { CampeonatoService, Campeonato } from "../services/campeonato-service";
import { Table } from "../components/Table";
import { useRouter } from "next/navigation";

export default function CampeonatosPage() {
  const [campeonatos, setCampeonatos] = useState<Campeonato[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  function mostraCampeonato(campeonatos: Campeonato[]){
    console.log(campeonatos);
    setCampeonatos(campeonatos)
  }

  useEffect(() => {
    CampeonatoService.listar()
      .then((page) => mostraCampeonato(page.content))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Carregando...</p>;

  return (
    <main style={styles.main}>
      <h1>Campeonatos</h1>

      <Table
        data={campeonatos}
        columns={[
          { header: "Nome", accessor: "nome" },
          { header: "Situação", accessor: "situacao" },
        ]}
        onView={(row) => router.push(`/campeonatos/${row.id}`)}
      />
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
};
