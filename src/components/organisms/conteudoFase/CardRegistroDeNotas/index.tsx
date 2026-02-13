"use client";

import { useEffect, useState } from "react";
import { AsyncSelect } from "@/components/atoms/AsyncSelect";
import { AtletaService } from "@/services/atleta-service";
import { getDescricaoTipoRegistroDisputaEnum, NotaForm, RegistroDisputaDto, TipoRegistroDisputaEnum } from "@/types/disputa";
import { JuradoService } from "@/services/jurado-service";
import { SelectOption } from "@/types/default";


type Props = {
  registro?: RegistroDisputaDto;
  onChangeNotas: (atletaId: string | undefined, notas: NotaForm[]) => void;
  campeonatoId: string;
};

export type NotaFormProps = {
    notaDoAtleta: number
    notaDaDupla: number
    jurado: SelectOption
}

export function CardRegistroDeNotas({registro, onChangeNotas, campeonatoId }: Props) {
  const [notas, setNotas] = useState<NotaFormProps[]>([
    { notaDoAtleta: 0, notaDaDupla: 0, jurado: {} as SelectOption},
    { notaDoAtleta: 0, notaDaDupla: 0, jurado: {} as SelectOption},
    { notaDoAtleta: 0, notaDaDupla: 0, jurado: {} as SelectOption},
  ]);

  const atletaId = registro?.atletaId;
  const isDesabilitado = getDescricaoTipoRegistroDisputaEnum(registro?.tipoRegistro).toUpperCase() == TipoRegistroDisputaEnum.NAO_PONTUADO.toUpperCase();
  useEffect(() => {
    if(isDesabilitado) return;

    onChangeNotas(atletaId, notas.map(nota => {
        return {
            notaDaDupla: nota.notaDaDupla,
            notaDoAtleta: nota.notaDoAtleta,
            juradoId: nota.jurado.id
        }
    }));
  }, [notas]);

  function updateNota(index: number, field: keyof NotaFormProps, value: any) {
    if(isDesabilitado) return;

    setNotas((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: field === "jurado" ? value : Number(value),
      };
      return updated;
    });
  }

  return (
    <div style={styles.card}>
      <div style={styles.cardHeader}>
        <h4>
          {registro?.numeroAtleta} - {registro?.nomeAtleta} ({registro?.apelidoAtleta})
        </h4>
        {isDesabilitado ? (<span style={{color: "var(--color-error)"}}>O competidor está apenas cumprindo tabela na rodada, logo não terá registro de nota</span>) :("") }

        <div style={styles.headerGrid}>
          <strong>Nota Individual</strong>
          <strong>Nota da Dupla</strong>
        </div>
      </div>

      <div style={styles.cardMain}>
        <div style={styles.cardMainNotas}>
          {notas.map((nota, index) => (
            <div key={index} style={styles.rowGrid}>
              {/* Nota Individual */}
              <select
                disabled={isDesabilitado}
                style={styles.select}
                value={nota.notaDoAtleta}
                onChange={(e) =>
                  updateNota(index, "notaDoAtleta", e.target.value)
                }
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option style={styles.select} key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>

              {/* Nota Dupla */}
              <select
                disabled={isDesabilitado}
                style={styles.select}
                value={nota.notaDaDupla}
                onChange={(e) =>
                  updateNota(index, "notaDaDupla", e.target.value)
                }
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option style={styles.select} key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    display: "grid",
    gridTemplateRows: "1fr 1fr",
    // backgroundColor: "#f9ff"
  },
  cardHeader: {

  },
  cardMain: {

  },
  select: {
    padding: "9px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    outline: "none",
    fontSize: "14px",
    width: "100%",
    transition: "border 0.2s",
  },
  cardMainNotas: {
    display: "grid",
    gridTemplateRows: "1fr 1fr 1fr",
    gap: "10px"
  },
  headerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    marginTop: "10px"
  },
  rowGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px"
  },
};
