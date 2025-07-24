import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ embedKey: string }> }
) {
  try {
    const { embedKey } = await params
    const supabase = createClient()
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('embed_key', embedKey)
      .eq('is_active', true)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: 'Widget not found' },
      { status: 404 }
    )
  }
}