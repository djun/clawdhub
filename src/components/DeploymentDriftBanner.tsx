import { useQuery } from 'convex/react'
import { useEffect } from 'react'
import { api } from '../../convex/_generated/api'
import { getDeploymentDriftInfo } from '../lib/deploymentDrift'

const FRONTEND_BUILD_SHA = import.meta.env.VITE_APP_BUILD_SHA?.trim() || null

export function DeploymentDriftBanner() {
  const deploymentInfo = useQuery(api.appMeta.getDeploymentInfo)
  const drift = getDeploymentDriftInfo({
    expectedBuildSha: FRONTEND_BUILD_SHA,
    actualBuildSha: deploymentInfo?.appBuildSha ?? null,
  })

  useEffect(() => {
    if (!drift.hasMismatch) return
    console.error('Deployment drift detected', drift)
  }, [drift])

  if (!drift.hasMismatch) return null

  return (
    <div
      role="alert"
      style={{
        margin: '16px auto 0',
        width: 'min(1100px, calc(100vw - 32px))',
        border: '1px solid #f59e0b',
        background: '#fff7ed',
        color: '#9a3412',
        borderRadius: '14px',
        padding: '12px 16px',
        fontSize: '0.95rem',
        lineHeight: 1.4,
      }}
    >
      Deploy mismatch detected. Frontend expects backend build
      {' '}
      <code>{drift.expectedBuildSha}</code>
      {' '}
      but Convex reports
      {' '}
      <code>{drift.actualBuildSha}</code>
      .
    </div>
  )
}
