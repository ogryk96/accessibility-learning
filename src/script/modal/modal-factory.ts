import modalMediator from './modal-mediator.js'

const create = () => {
  const openers = Array.from(document.querySelectorAll<HTMLElement>('.js-modal-opener'))
  const backgroundElement = document.querySelector<HTMLElement>('.js-modal-background')
  const focusableElementsQuery = "a, button, input, textarea, select, details, [tabindex]:not([tabindex='-1'])"

  const modalMediators = openers.map(opener => {
    const contentId = opener.dataset.modalOpen ?? 'NULL'
    const content = document.querySelector<HTMLElement>(`#${contentId}`)
    const overlay = content?.querySelector<HTMLElement>('.js-overlay')
    const focusableElements = content?.querySelectorAll<HTMLElement>(focusableElementsQuery) ?? []

    return modalMediator({
      content: content!,
      overlay: overlay!,
      opener,
      backgroundElement: backgroundElement!,
      focusableElements: Array.from(focusableElements),
    })
  })

  return modalMediators
}

export default {
  create,
}
