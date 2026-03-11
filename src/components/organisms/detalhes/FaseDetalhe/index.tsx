"use client";

import { Tab } from "@/components/modecules/Tab";
import { Notify } from "@/lib/notify";
import { Utils } from "@/services/utils";
import { ExceptionDefault } from "@/types/default";
import { useEffect, useState } from "react";
import { CardTitle } from "../../../atoms/CardTitle";
import { CategoriaDto } from "@/types/categoria";
import { CategoriaService } from "@/services/categoria-service";
import { FaseDto, getDescricaoCriteriorEntradaEnum } from "@/types/fase";
import { FaseService } from "@/services/fase-service";
import { ConteudoRodasFase } from "../../conteudoFase/ConteudoRodadasFase";
import { ConteudoCompetidoresFase } from "../../conteudoFase/ConteudoCompetidoresFase";
import { CardRankingFase } from "../../conteudoFase/CardRankingFase";
import { SwitchInput } from "@/components/atoms/SwitchInput";

type Props = {
    categoriaId: string,
    faseId: string
};

export default function FaseDetalhe({ categoriaId , faseId}: Props) {
  const [categoria, setCategoria] = useState<CategoriaDto>({} as CategoriaDto);
  const [fase, setFase] = useState<FaseDto>({} as FaseDto);
  const [isLoadingHabilitarEDesabilitarCompartilhamento, setIsLoadingHabilitarEDesabilitarCompartilhamento] = useState(false);

  async function buscaCategoriaPorId() {
    try {
      const categoriaResponse = await CategoriaService.buscaCategoriaPorId(categoriaId);
      setCategoria(categoriaResponse)
    } catch(error: any){
      if(error.response){
        const exception = error.response.data as ExceptionDefault;
        Notify.error(exception.mensagem)
      }else{
        Notify.error("Não foi possível buscar a categoria da fase informado.")
      }
    }
  }

  async function buscaFasePorId() {
    try {
      const faseResponse = await FaseService.buscaFasePorId(faseId);
      setFase(faseResponse)
    } catch(error: any){
      if(error.response){
        const exception = error.response.data as ExceptionDefault;
        Notify.error(exception.mensagem)
      }else{
        Notify.error("Não foi possível buscar a fase com id informado.")
      }
    }
  }

  async function desabilitarCompartilhamento() {
      try{
          setIsLoadingHabilitarEDesabilitarCompartilhamento(true);
          const resultado = await FaseService.desabilitarCompartilhamento(faseId);
          Notify.success("Compartilhamento desabilitado com sucesso.");
          setFase(resultado);

      } catch(error: any){
          if(error.response){
            const exception = error.response.data as ExceptionDefault;
            Notify.error(exception.erros[0])
          }else{
              Notify.error("Erro desconhecido ao tentar desabilitar compartilhamento.")
          }
      } finally {
          setIsLoadingHabilitarEDesabilitarCompartilhamento(false);
      }
  }
  
  async function habilitarCompartilhamento() {
      try{
          setIsLoadingHabilitarEDesabilitarCompartilhamento(true);
          const resultado = await FaseService.habilitarCompartilhamento(faseId);
          Notify.success("Compartilhamento habilitado com sucesso.");
          setFase(resultado);

      } catch(error: any){
          if(error.response){
            const exception = error.response.data as ExceptionDefault;
            Notify.error(exception.erros[0])
          }else{
              Notify.error("Erro desconhecido ao tentar habilitar compartilhamento.")
          }
      } finally {
          setIsLoadingHabilitarEDesabilitarCompartilhamento(false);
      }
  }

  useEffect(() => {
    buscaCategoriaPorId();
    buscaFasePorId();
  }, []);

  return (
    <main style={styles.main}>
      <CardTitle>
        <div style={{display: "flex", width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
            <h1>Fase {fase?.nome}</h1>
            <strong>Critério de entrada {getDescricaoCriteriorEntradaEnum(fase.criterioEntrada)} - Situação {fase?.situacao}</strong>
            <SwitchInput
                  value={fase.isCompartilhada}
                  disabled={isLoadingHabilitarEDesabilitarCompartilhamento}
                  onChange={async (valor) => {
                      if(valor){
                        await habilitarCompartilhamento()
                      }else{
                         await desabilitarCompartilhamento()
                      }
                  }}
                  labelOn={isLoadingHabilitarEDesabilitarCompartilhamento ? "Carregando" : "Compartilhamento Ativo"}
                  labelOff={isLoadingHabilitarEDesabilitarCompartilhamento ? "Carregando" : "Não Compartilhado"}
              />
        </div>
        {/* <div style={styles.containerDados}>
          <div>
            <p>Competidores</p>
            <p>{fase?.quantidadeAtletas} competidores</p>
          </div>
          <div>
            <p>Fases</p>
            <p>{fase?.quantidadeFases} fases</p>
          </div>
        </div> */}
      </CardTitle>
      <Tab
        tabs={[
          { label: "Competidores da fase", content: <ConteudoCompetidoresFase faseId={faseId} campeonatoId={categoria.campeonatoId} categoriaId={categoria.id}/>},
          { label: "Rodadas", content: <ConteudoRodasFase categoriaId={categoriaId} faseId={faseId} campeonatoId={categoria.campeonatoId}/>},
          { label: "Ranking", content: <CardRankingFase faseId={faseId} campeonatoId={categoria.campeonatoId} />}
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
  containerDados: {
    display: "flex",
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  }
}