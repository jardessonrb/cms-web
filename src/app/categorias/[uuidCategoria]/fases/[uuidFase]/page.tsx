import CategoriaDetalhe from "@/components/organisms/detalhes/CategoriaDetalhe";
import FaseDetalhe from "@/components/organisms/detalhes/FaseDetalhe";

type Props = {
 params: Promise<{
    uuidCategoria: string;
    uuidFase: string
  }>;
};

export default async function FaseDetalhePage({ params }: Props) {
  const { uuidCategoria,  uuidFase } = await params
  return <FaseDetalhe categoriaId={uuidCategoria} faseId={uuidFase}/>
}