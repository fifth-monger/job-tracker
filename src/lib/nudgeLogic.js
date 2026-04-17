import { NUDGE_TYPES } from './constants'

function daysSince(dateStr) {
  const then = new Date(dateStr)
  const now = new Date()
  return Math.floor((now - then) / (1000 * 60 * 60 * 24))
}

function hoursSince(isoStr) {
  const then = new Date(isoStr)
  const now = new Date()
  return (now - then) / (1000 * 60 * 60)
}

export function computeNudges(applications, dismissedKeys) {
  const nudges = []

  for (const app of applications) {
    const noResponseKey = `${app.id}:${NUDGE_TYPES.NO_RESPONSE}`
    if (
      app.status === 'Applied' &&
      daysSince(app.date_applied) >= 7 &&
      !dismissedKeys.has(noResponseKey)
    ) {
      nudges.push({
        key: noResponseKey,
        id: app.id,
        type: NUDGE_TYPES.NO_RESPONSE,
        message: `${app.company} — ${app.role}: No update in ${daysSince(app.date_applied)} days. Worth following up?`,
      })
    }

    const thankYouKey = `${app.id}:${NUDGE_TYPES.THANK_YOU}`
    if (
      app.status === 'Interviewing' &&
      hoursSince(app.updated_at) >= 24 &&
      !dismissedKeys.has(thankYouKey)
    ) {
      nudges.push({
        key: thankYouKey,
        id: app.id,
        type: NUDGE_TYPES.THANK_YOU,
        message: `${app.company} — ${app.role}: Did you send a thank-you note?`,
      })
    }
  }

  return nudges
}
