import WidgetLoader from '@/components/widget/WidgetLoader'

export default async function WidgetPage({
  params,
}: {
  params: Promise<{ embedKey: string }>
}) {
  const { embedKey } = await params
  return <WidgetLoader embedKey={embedKey} />
}