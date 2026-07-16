export const STATUSES = [
  'Applied',
  'Followed-Up',
  'Interviewing',
  'Offer',
  'Accepted',
  'Rejected',
  'Dead End',
]

export const DEFAULT_STATUS = 'Applied'

export const ARCHIVE_STATUSES = ['Rejected', 'Dead End']

/** Rows shown in the At a Glance sidebar (label + which statuses to count). */
export const SUMMARY_STATUS_ROWS = [
  { key: 'Applied', label: 'Applied', statuses: ['Applied'], colorVar: 'applied' },
  { key: 'Followed-Up', label: 'Followed-Up', statuses: ['Followed-Up'], colorVar: 'followed-up' },
  { key: 'Interviewing', label: 'Interviewing', statuses: ['Interviewing'], colorVar: 'interviewing' },
  { key: 'Offer', label: 'Offer', statuses: ['Offer'], colorVar: 'offer' },
  { key: 'Closed', label: 'Closed', statuses: ARCHIVE_STATUSES, colorVar: 'rejected' },
]

export const NUDGE_TYPES = {
  NO_RESPONSE: 'no-response',
  THANK_YOU: 'thank-you',
}

export function emptyForm() {
  return {
    company: '',
    role: '',
    date_applied: new Date().toISOString().split('T')[0],
    status: DEFAULT_STATUS,
    salary_range: '',
    contact: '',
    source: '',
    notes: '',
    is_archived: false,
  }
}

export function isArchived(application) {
  return Boolean(application?.is_archived)
}

export function shouldAutoArchive(status) {
  return ARCHIVE_STATUSES.includes(status)
}
