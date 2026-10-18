import {workbenchStatus} from '@/lib/workbench-connection.mjs'
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export async function GET() { return workbenchStatus() }
