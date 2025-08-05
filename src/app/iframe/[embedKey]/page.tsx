'use client'

import IframeWidget from '@/components/widget/IframeWidget'

interface IframePageProps {
  params: {
    embedKey: string
  }
}

export default function IframePage({ params }: IframePageProps) {
  return <IframeWidget embedKey={params.embedKey} />
}