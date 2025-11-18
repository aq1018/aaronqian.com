import * as clack from '@clack/prompts'

/**
 * Handle cancel action
 * @param {unknown} value
 * @returns {void}
 */
export function handleCancel(value) {
  if (clack.isCancel(value)) {
    clack.cancel('Operation cancelled')
    process.exit(0)
  }
}

/**
 * Prompt for title
 * @param {string} type
 * @returns {Promise<string>}
 */
export async function promptTitle(type) {
  const title = await clack.text({
    message: `${type} title:`,
    placeholder: `My Awesome ${type}`,
    validate: (value) => {
      if (value.length === 0) return 'Title is required'
    },
  })

  handleCancel(title)
  return String(title)
}

/**
 * Prompt for slug
 * @param {string} autoSlug
 * @param {string} label
 * @returns {Promise<string>}
 */
export async function promptSlug(autoSlug, label = 'URL slug') {
  const slug = await clack.text({
    message: `${label}:`,
    placeholder: autoSlug,
    initialValue: autoSlug,
    validate: (value) => {
      if (value.length === 0) return 'Slug is required'
      if (!/^[a-z0-9-]+$/.test(String(value))) {
        return 'Slug must contain only lowercase letters, numbers, and hyphens'
      }
    },
  })

  handleCancel(slug)
  return String(slug)
}

/**
 * Prompt for description
 * @param {string} placeholder
 * @returns {Promise<string>}
 */
export async function promptDescription(placeholder) {
  const description = await clack.text({
    message: 'Description:',
    placeholder,
    validate: (value) => {
      if (value.length === 0) return 'Description is required'
    },
  })

  handleCancel(description)
  return String(description)
}

/**
 * Prompt for date
 * @param {string} todayStr
 * @returns {Promise<string>}
 */
export async function promptDate(todayStr) {
  const dateInput = await clack.text({
    message: 'Date (YYYY-MM-DD):',
    placeholder: todayStr,
    initialValue: todayStr,
    validate: (value) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) {
        return 'Date must be in YYYY-MM-DD format'
      }
    },
  })

  handleCancel(dateInput)
  return String(dateInput)
}

/**
 * Prompt for draft status
 * @returns {Promise<boolean>}
 */
export async function promptDraft() {
  const isDraft = await clack.confirm({
    message: 'Save as draft?',
    initialValue: false,
  })

  handleCancel(isDraft)
  return Boolean(isDraft)
}

/**
 * Prompt for tags
 * @param {string} placeholder
 * @param {boolean} required
 * @returns {Promise<string[]>}
 */
export async function promptTags(placeholder, required = false) {
  const tagsInput = await clack.text({
    message: `Tags (comma-separated${required ? '' : ', optional'}):`,
    placeholder,
    validate: (value) => {
      if (required && value.length === 0) {
        return 'At least one tag is required'
      }
    },
  })

  handleCancel(tagsInput)

  const inputStr = String(tagsInput)
  if (inputStr.length === 0) {
    return []
  }

  return inputStr
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0)
}
