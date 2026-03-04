import { api } from "./api";
import { Utils } from "./utils";


export const RelatorioService = {
    async downloadRankingFase(faseId: string): Promise<void> {
        const response = await api.get(`/relatorios/fase/${faseId}/download-ranking-pdf`, {
            responseType: "blob",
        });

        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `ranking-fase.pdf`;

        document.body.appendChild(link);
        link.click();

        link.remove();
        window.URL.revokeObjectURL(url);
    }
}