import { Tab } from "@/app/components/modecules/Tab";
import { ConteudoCompetidores } from "@/app/components/organisms/ConteudoCompetidores";

type Props = {
  params: Promise<{
    uuid: string;
  }>;
};

export default async function CampeonatoDetalhePage({ params }: Props) {
  const { uuid } = await params;

  return (
    <main style={styles.main}>
      <div style={styles.containerInformacoes}>
        <h1>Jogos Alliança-Capoeira - 14/03/2026</h1>
        <div style={styles.containerDadosCampeonato}>
          <div>
            <p>Competidores</p>
            <p>65 competidores</p>
          </div>
          <div>
            <p>Categorias</p>
            <p>6 categorias</p>
          </div>
          <div>
            <p>Jurados</p>
            <p>7 jurados</p>
          </div>
        </div>
      </div>

      <Tab
        tabs={[
          { label: "Competidores", content: <ConteudoCompetidores  campeonatoId={uuid}/> },
          { label: "Categorias", content: <div>Conteúdo da Parte 2</div> },
          { label: "Jurados", content: <div>Conteúdo da Parte 3</div> },
        ]}
      />

    </main>
  );
}


const styles: Record<string, React.CSSProperties> = {
  main: {
    // backgroundColor: "var(--color-bg-light)",
    minHeight: "100vh",
    width: "95%",
    paddingLeft: 10,
    paddingRight: 10
  },
  containerInformacoes: {
    width: "95%",
    minHeight: "150px",
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 20,
    backgroundColor: "var(--color-bg-light)",
    borderRadius: 20,
    marginTop: 10
  },
  containerDadosCampeonato: {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  }
}