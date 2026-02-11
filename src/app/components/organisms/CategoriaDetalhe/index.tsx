"use client";

import { Tab } from "@/app/components/modecules/Tab";
import { Notify } from "@/app/lib/notify";
import { Utils } from "@/app/services/utils";
import { ExceptionDefault } from "@/app/types/default";
import { useEffect, useState } from "react";
import { CardTitle } from "../../atoms/CardTitle";
import { CategoriaDto } from "@/app/types/categoria";
import { CategoriaService } from "@/app/services/categoria-service";
import { ConteudoCompetidoresCategoria } from "../ConteudoCompetidoresCategoria";

type Props = {
    categoriaId: string
};

export default function CategoriaDetalhe({ categoriaId }: Props) {
  const [categoria, setCategoria] = useState<CategoriaDto>({} as CategoriaDto);

  async function buscaCategoriaPorId() {
      
    try {
      const categoriaResponse = await CategoriaService.buscaCategoriaPorId(categoriaId);
      console.log(categoriaResponse)
      setCategoria(categoriaResponse)
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
    buscaCategoriaPorId();
  }, []);

  return (
    <main style={styles.main}>
      <CardTitle>
        <div style={{display: "flex", width: "100%", flexDirection: 'column', alignItems: 'center', justifyContent: "center"}}>
            <h1>Categoria {categoria?.nome}</h1>
            <strong>Criado em {Utils.formataDataBR(categoria?.criadoEm)} - Situação {categoria?.situacao}</strong>
        </div>
        <div style={styles.containerDados}>
          <div>
            <p>Competidores</p>
            <p>{categoria?.quantidadeAtletas} competidores</p>
          </div>
          <div>
            <p>Fases</p>
            <p>{categoria?.quantidadeFases} fases</p>
          </div>
        </div>
      </CardTitle>
      <Tab
        tabs={[
          { label: "Competidores", content: <ConteudoCompetidoresCategoria categoriaId={categoriaId} campeonatoId={categoria.campeonatoId}/>},
          { label: "Fases", content: <div>Fases</div>}
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