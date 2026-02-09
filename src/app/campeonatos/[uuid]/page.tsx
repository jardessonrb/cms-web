type Props = {
  params: Promise<{
    uuid: string;
  }>;
};

export default async function CampeonatoDetalhePage({ params }: Props) {
  const { uuid } = await params;

  return (
    <main style={{ padding: "24px" }}>
      <h1>Detalhe do Campeonato</h1>
      <p>UUID: {uuid}</p>
    </main>
  );
}