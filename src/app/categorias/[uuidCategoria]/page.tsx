type Props = {
 params: Promise<{
    uuidCategoria: string;
  }>;
};

export default async function CategoriaDetalhePage({ params }: Props) {
  const { uuidCategoria } = await params
  return <div><strong>Categoria - {uuidCategoria}</strong></div>
}