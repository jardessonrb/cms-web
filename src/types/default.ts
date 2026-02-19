export type ExceptionDefault = {
    mensagem: string;
    statusCode: number;
    path: string;
    erros: string[]
}

export interface ListParams {
  page: number;
  size: number;
  filtro?: string | undefined
  sort?: string[]
  situacao?: string
}

export type SelectOption = {
  id: string;
  label: string;
}