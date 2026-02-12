export enum SituacaoDisputaEnum {
    PENDENTE = "Pendente",
    CONCLUIDA = "Concluída"
}

export enum TipoRegistroDisputaEnum {
    PONTUADO = "Pontuado",
    NAO_PONTUADO = "Não Pontuado"
}

export enum TipoDisputaEnum {
    DUPLA = "Dupla",
    INDIVIDUAL = "Individual"
}

export type DisputaDto = {
    id: string
    situacao: SituacaoDisputaEnum
    rodadaId: string
    tipoDisputa: TipoDisputaEnum
    registrosDisputa: RegistroDisputaDto[]
    criadoEm: string
}

export type RegistroDisputaDto = {
    id: string
    nomeAtleta: string
    numeroAtleta: number
    apelidoAtleta: string
    atletaId: string
    tipoRegistro: TipoRegistroDisputaEnum
}

export function getDescricaoTipoRegistroDisputaEnum(e: TipoRegistroDisputaEnum): string {
    if(e == undefined) return "";
    return TipoRegistroDisputaEnum[e.toString() as keyof typeof TipoRegistroDisputaEnum]
}

export function getDescricaoSituacaoDisputaEnum(e: SituacaoDisputaEnum): string {
    if(e == undefined) return "";
    return SituacaoDisputaEnum[e.toString() as keyof typeof SituacaoDisputaEnum]
}

export function getDescricaoTipoDisputaEnum(e: TipoDisputaEnum): string {
    if(e == undefined) return "";
    return TipoDisputaEnum[e.toString() as keyof typeof TipoDisputaEnum]
}