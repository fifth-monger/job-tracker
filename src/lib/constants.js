export const STATUSES = ['Applied', 'Followed-Up', 'Interviewing', 'Offer', 'Accepted', 'Rejected']

export const DEFAULT_STATUS = 'Applied'

export const NUDGE_TYPES = {
  NO_RESPONSE: 'no-response',
  THANK_YOU: 'thank-you',
}

export const EMPTY_FORM = {
  company: '',
  role: '',
  date_applied: new Date().toISOString().split('T')[0],
  status: DEFAULT_STATUS,
  salary_range: '',
  contact: '',
  source: '',
  notes: '',
}
