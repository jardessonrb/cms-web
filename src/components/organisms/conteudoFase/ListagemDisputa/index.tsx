import { DataCell, DataRow, DataTable, DataTableBody, DataTableHeader } from "@/components/Table";
import { useState } from "react";

type ListagemDisputaProps = {
    faseId: string
}

export function ListagemDisputa({ faseId }: ListagemDisputaProps){
    const [disputas, setDisputas] = useState<any[]>([
        {
            id: "odofofofoof-fo4i3-33k4k43-3jja",
            nome: "Fulano vs Sicrano",
            situacao: "Pendente"
        },
        {
            id: "odofofofoof-fo4i3-33k4k43-3jjb",
            nome: "Fulano vs Sicrano",
            situacao: "Pendente"
        },{
            id: "odofofofoof-fo4i3-33k4k43-3jjc",
            nome: "Fulano vs Sicrano",
            situacao: "Concluída"
        },{
            id: "odofofofoof-fo4i3-33k4k43-3jjd",
            nome: "Fulano vs Sicrano",
            situacao: "Concluída"
        },{
             id: "odofofofoof-fo4i3-33k4k43-3jjd",
            nome: "Fulano vs Sicrano",
            situacao: "Concluída"
        },
    ])
    return (
        <div style={styles.container}>
            <DataTable style={{width: "100%"}}>
                <DataTableHeader columns="4fr 2fr 2fr 1fr" style={styles.dataTableHeader}>
                    <div><strong>Competidores</strong></div>
                    <div><strong>Tipo de disputa</strong></div>
                    <div><strong>Situação</strong></div>
                    <div style={{display: "flex", justifyContent: 'center'}}><strong>Ações</strong></div>
                </DataTableHeader>
        
                <DataTableBody maxHeight={"350px"} style={{paddingRight: "10px"}}>
                    {disputas && disputas.length > 0 ? (
                        disputas.map((disputa) => {
                            return (
                                <DataRow key={disputa.id} columns="4fr 2fr 2fr 1fr" style={{backgroundColor: "var(--color-bg-light)"}}>
                                    <DataCell>{disputa.nome}</DataCell>
                                    <DataCell>Tipo de disputa</DataCell>
                                    <DataCell>{disputa.situacao}</DataCell>
                                    <DataCell style={{display: "flex", flexDirection: 'column', justifyContent: 'space-between'}}>
                                        <button onClick={() => () => {}}>
                                            Adicionar Notas
                                        </button>
                                    </DataCell>
                                </DataRow>
                            )
                        })
                    ) : (<strong>Nenhuma rodada encontrada criada</strong>)}
                </DataTableBody>
            </DataTable>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        width: '100%',
        // backgroundColor: "var(--color-bg-light)",
        // backgroundColor: "#d4d4",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        // padding: "10px 0px",
        borderBottomRightRadius: "10px",
        borderBottomLeftRadius: "10px",
    },
    dataTableHeader: {
        alignItems: "center",
        minHeight: "80px",
        marginTop: "10px",
        padding: "5px",
        marginRight: "10px",
        backgroundColor: "var(--color-bg-light)",
        borderRadius: "10px"
    }
};