"use client";

import { useEffect, useState } from "react";
import { AsyncSelect } from "@/components/atoms/AsyncSelect";
import { AtletaService } from "@/services/atleta-service";
import { NotaForm, RegistroDisputaDto } from "@/types/disputa";
import { JuradoService } from "@/services/jurado-service";
import { SelectOption } from "@/types/default";


type Props = {
  registro?: RegistroDisputaDto;
  onChangeNotas: (notas: NotaForm[]) => void;
  campeonatoId: string
};

export type NotaFormProps = {
    notaDoAtleta: number
    notaDaDupla: number
    jurado: SelectOption
}

export function CardRegistroDeNotas({ registro, onChangeNotas, campeonatoId }: Props) {
  const [notas, setNotas] = useState<NotaFormProps[]>([
    { notaDoAtleta: 0, notaDaDupla: 0, jurado: {} as SelectOption},
    { notaDoAtleta: 0, notaDaDupla: 0, jurado: {} as SelectOption},
    { notaDoAtleta: 0, notaDaDupla: 0, jurado: {} as SelectOption},
  ]);

  useEffect(() => {
    onChangeNotas(notas.map(nota => {
        return {
            notaDaDupla: nota.notaDaDupla,
            notaDoAtleta: nota.notaDoAtleta,
            juradoId: nota.jurado.id
        }
    }));
  }, [notas]);

  function updateNota(index: number, field: keyof NotaFormProps, value: any) {
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
      <h4>
        {registro?.numeroAtleta} - {registro?.nomeAtleta} ({registro?.apelidoAtleta})
      </h4>

      <div style={styles.headerGrid}>
        <strong>Nota Individual</strong>
        <strong>Nota Dupla</strong>
        <strong>Jurado</strong>
      </div>

      {notas.map((nota, index) => (
        <div key={index} style={styles.rowGrid}>
          {/* Nota Individual */}
          <select
            value={nota.notaDoAtleta}
            onChange={(e) =>
              updateNota(index, "notaDoAtleta", e.target.value)
            }
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Nota Dupla */}
          <select
            value={nota.notaDaDupla}
            onChange={(e) =>
              updateNota(index, "notaDaDupla", e.target.value)
            }
          >
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>

          {/* Jurado */}
          <AsyncSelect
            placeholder="Escolher Jurado"
            value={nota.jurado}
            onSelect={(value) => updateNota(index, "jurado", value)}
            fetchOptions={async (query) => {
              const page = await JuradoService.listaJuradosDoCampeonato(campeonatoId, {
                page: 0,
                size: 5,
                filtro: query && query.length >= 3 ? query : undefined,
              });

              return page.content.map((jurado) => ({
                id: jurado.id,
                label: `${jurado.apelido}-${jurado.grupo}`,
              }));
            }}
          />
        </div>
      ))}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  card: {
    backgroundColor: "var(--color-bg-light)",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  headerGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 2fr",
    gap: "10px",
    marginTop: "10px",
  },
  rowGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 2fr",
    gap: "10px",
    alignItems: "center",
  },
};
