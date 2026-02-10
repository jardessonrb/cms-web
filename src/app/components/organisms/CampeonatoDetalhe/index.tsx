"use client";

import { Tab } from "@/app/components/modecules/Tab";
import { ConteudoCompetidores } from "@/app/components/organisms/ConteudoCompetidores";
import { Notify } from "@/app/lib/notify";
import { CampeonatoService } from "@/app/services/campeonato-service";
import { Utils } from "@/app/services/utils";
import { CampeonatoDetalhadoDto } from "@/app/types/campeonato";
import { ExceptionDefault } from "@/app/types/default";
import { useEffect, useState } from "react";
import { ConteudoCategorias } from "../ConteudoCategorias";

type Props = {
    campeonatoId: string
};

export default function CampeonatoDetalhe({ campeonatoId }: Props) {
  const [campeonato, setCampeonato] = useState<CampeonatoDetalhadoDto | null>(null);

  async function buscaCampeonatoPorId() {
      
    try {
      const campeonatoResponse = await CampeonatoService.buscaCampeonatoPorId(campeonatoId);
      setCampeonato(campeonatoResponse)
    } catch(error: any){
      if(error.response){
          const exception = error.response.data as ExceptionDefault;
          Notify.error(exception.mensagem)
      }else{
        Notify.error("Não foi possível buscar o campeonato com id informado.")
      }
    }
  }

  useEffect(() => {
    buscaCampeonatoPorId();
  }, []);

  return (
    <main style={styles.main}>
      <div style={styles.containerInformacoes}>
        <div style={{display: "flex", width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
            <h1>{campeonato?.nome}</h1>
            <strong>Criado em {Utils.formataDataBR(campeonato?.criadoEm)} - Situação {campeonato?.situacao}</strong>
        </div>
        <div style={styles.containerDadosCampeonato}>
          <div>
            <p>Competidores</p>
            <p>{campeonato?.quantidadeAtletas} competidores</p>
          </div>
          <div>
            <p>Categorias</p>
            <p>{campeonato?.quantidadeCategorias} categorias</p>
          </div>
          <div>
            <p>Jurados</p>
            <p>{campeonato?.quantidadeJurados} jurados</p>
          </div>
        </div>
      </div>

      <Tab
        tabs={[
          { label: "Competidores", content: <ConteudoCompetidores  campeonatoId={campeonatoId}/> },
          { label: "Categorias", content: <ConteudoCategorias campeonatoId={campeonatoId} /> },
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