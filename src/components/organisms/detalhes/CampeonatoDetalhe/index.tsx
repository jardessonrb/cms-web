"use client";

import { Tab } from "@/components/modecules/Tab";
import { ConteudoCompetidores } from "@/components/organisms/conteudoCampeonato/ConteudoCompetidores";
import { Notify } from "@/lib/notify";
import { CampeonatoService } from "@/services/campeonato-service";
import { Utils } from "@/services/utils";
import { CampeonatoDetalhadoDto, getDescricaoSituacaoCampeonatoEnum } from "@/types/campeonato";
import { ExceptionDefault } from "@/types/default";
import { useEffect, useState } from "react";
import { ConteudoCategorias } from "../../../organisms/conteudoCampeonato/ConteudoCategorias";
import { ConteudoJurados } from "../../../organisms/conteudoCampeonato/ConteudoJurados";
import { CardTitle } from "../../../atoms/CardTitle";
import { ConteudoCompartilhamento } from "../../conteudoCampeonato/ConteudoCompartilhamento";
import { SituacaoEstilizada, SituacaoType } from "@/components/atoms/SituacaoEstilizada";

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

  function definirCorConformeSituacao(situacao: string): SituacaoType {
    if(situacao === "Iniciado" || situacao === "Criado"){
      return "SUCCESS"
    }

    if(situacao === "Finalizado"){
      return "CONFIRM"
    }

    return "DANGER"
  }

  useEffect(() => {
    buscaCampeonatoPorId();
  }, []);

  return (
    <main style={styles.main}>
      <CardTitle>
        <div style={{display: "flex", width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
            <h1>Competição {campeonato?.nome}</h1>
            <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "20px"}}>
              <strong>Criado por {campeonato?.nomeUsuarioCriador} em {Utils.formataDataBR(campeonato?.criadoEm)}.</strong>
              <SituacaoEstilizada children={getDescricaoSituacaoCampeonatoEnum(campeonato?.situacao)} funcType={situacao => definirCorConformeSituacao(situacao)}/>
            </div>
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
      </CardTitle>
      <Tab
        tabs={[
          { label: "Competidores", content: <ConteudoCompetidores  campeonatoId={campeonatoId}/> },
          { label: "Categorias", content: <ConteudoCategorias campeonatoId={campeonatoId} /> },
          { label: "Jurados", content: <ConteudoJurados campeonatoId={campeonatoId} /> },
          { label: "Compartilhamento", content: <ConteudoCompartilhamento campeonatoId={campeonatoId} /> },
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