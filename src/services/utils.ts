import { SituacaoType } from "@/components/atoms/SituacaoEstilizada";

export const Utils = {
  removeChavesSemValor<T extends Record<string, any>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([_, value]) => value !== null && value !== undefined && value !== ""
      )
    ) as Partial<T>;
  },

  updateField<T extends Record<string, any>, K extends keyof T>(
    setState: React.Dispatch<React.SetStateAction<T>>,
    field: K,
    value: T[K]
  ) {
    setState((prev) => ({...prev, [field]: value}));
  },
  formataDataBR(dateTime: string | undefined): string {
    if(!dateTime || dateTime == undefined){
      return "";
    }

    const date = new Date(dateTime);

    const dia = String(date.getDate()).padStart(2, "0");
    const mes = String(date.getMonth() + 1).padStart(2, "0");
    const ano = date.getFullYear();

    return `${dia}/${mes}/${ano}`;
  },
  uniNomeAndApelidoAndNumero(nome: string, apelido: string, numero: number): string {
    const primeiroNome = nome.split(" ")[0];
    const numeroExistente = numero ? (numero + " - "): "";
    const apelidoAjustado = apelido ? `(${apelido})` : ""

    return `${numeroExistente}${primeiroNome}${apelidoAjustado}`;
  },
  isNumeroValido(value?: string): boolean {
    if (!value) return false;

    return /^[0-9]+$/.test(value);
  },
  definirCorConformeSituacaoAtleta(situacao: string) : SituacaoType {
    if(situacao === "Ativo" || situacao === "Criado"){
      return "SUCCESS"
    }

    if(situacao === "Finalizado"){
      return "CONFIRM"
    }

    return "DANGER"
  }
};