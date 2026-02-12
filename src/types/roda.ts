export type RodadaDto = {
    id: string
    nome: string
    situacao: SituacaoRodadaEnum
    tipoRodada: TipoRodadaEnum
    atletasParaProximaFase: number
    criadoEm: string
    disputasConcluidas: number
    disputasPendentes: number
}

export enum TipoRodadaEnum  {
    NORMAL = "Normal",
    DESEMPATE = "Desempate"
}

export enum SituacaoRodadaEnum {
    CRIADA = "Criada",
    INICIADA = "Iniciada",
    FINALIZADA = "Finalizada"
}


export function getDescricaoSituacaoRodadaEnum(e: SituacaoRodadaEnum): string {
    if(e == undefined) return "";
    return SituacaoRodadaEnum[e.toString() as keyof typeof SituacaoRodadaEnum]
}

export function getDescricaoTipoRodadaEnum(e: TipoRodadaEnum): string {
    if(e == undefined) return "";
    return TipoRodadaEnum[e.toString() as keyof typeof TipoRodadaEnum]
}