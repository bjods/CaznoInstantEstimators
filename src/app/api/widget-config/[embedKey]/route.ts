import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ embedKey: string }> }
) {
  try {
    const { embedKey } = await params
    const { data, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('embed_key', embedKey)
      .eq('is_active', true)
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Widget not found' },
      { status: 404 }
    )
  }
}