import CategoriaDetalhe from "@/app/components/organisms/CategoriaDetalhe";

type Props = {
 params: Promise<{
    uuidCategoria: string;
  }>;
};

export default async function CategoriaDetalhePage({ params }: Props) {
  const { uuidCategoria } = await params
  return <CategoriaDetalhe categoriaId={uuidCategoria}/>
}