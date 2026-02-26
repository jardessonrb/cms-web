import ConteudoCompartilhamento from "@/components/organisms/ConteudoCompartilhamento";
import { Suspense } from "react";

export default function CompartilhamentoPage() {
    return (
        <Suspense fallback={<div>Carregando...</div>}>
            <ConteudoCompartilhamento />
        </Suspense>
  );
};