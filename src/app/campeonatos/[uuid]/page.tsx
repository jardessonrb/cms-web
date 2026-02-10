import CampeonatoDetalhe from "@/app/components/organisms/CampeonatoDetalhe";

type Props = {
 params: Promise<{
    uuid: string;
  }>;
};

export default async function CampeonatoDetalhePage({ params }: Props) {
  const { uuid } = await params
  return <CampeonatoDetalhe campeonatoId={uuid} />;
}