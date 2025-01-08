const setUpDialogModal = (dialog: HTMLDialogElement) => {
  const dialogID = dialog.id
  const openers = document.querySelectorAll(`[data-dialog-open="${dialogID}"]`)
  const closers = dialog.querySelectorAll('[data-dialog-close]')
  const focusableElements = Array.from(
    dialog.querySelectorAll<HTMLElement>(
      "a, button, input, textarea, select, details, [tabindex]:not([tabindex='-1'])",
    ),
  )
  const HIDDEN_CLASS = 'is-hidden'

  /**
   * @param dialog
   */
  const closeDialog = () => {
    dialog.classList.add(HIDDEN_CLASS)

    dialog.addEventListener(
      'animationend',
      () => {
        dialog.classList.remove(HIDDEN_CLASS)
        dialog.close()
        document.body.style.overflow = ''
      },
      { once: true },
    )
  }

  openers.forEach(opener => {
    opener?.addEventListener('click', () => {
      dialog.showModal()
      document.body.style.overflow = 'hidden'
    })
  })

  closers.forEach(closer => {
    closer.addEventListener('click', () => {
      closeDialog()
    })
  })

  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog()
  })

  /** keyupイベントハンドラー */
  const onKeyUp = (event: KeyboardEvent) => {
    event.preventDefault()
    if (event.key === 'Escape') closeDialog()
  }

  /** keydownイベントハンドラー */
  const onKeyDown = (event: KeyboardEvent) => {
    const activeIndex = focusableElements?.findIndex(el => el === document.activeElement) ?? 0

    if (focusableElements) {
      const elementToFocus = (event => {
        const firstElement = focusableElements[0]
        const lastElement = focusableElements.slice(-1)[0]
        const tabKey = event.key === 'Tab'
        const shiftKey = event.shiftKey

        const shouldFocusNext = !shiftKey && tabKey
        const shouldFocusPrev = shiftKey && tabKey

        switch (true) {
          case shouldFocusNext:
            return focusableElements[activeIndex + 1] ?? firstElement
          case shouldFocusPrev:
            return focusableElements[activeIndex - 1] ?? lastElement
          default:
            break
        }
      })(event)

      if (elementToFocus) {
        event.preventDefault()
        elementToFocus.focus()
      }
    }
  }

  dialog.addEventListener('keyup', onKeyUp)
  dialog.addEventListener('keydown', onKeyDown)
}

const dialogInit = () => {
  const dialogs = document.querySelectorAll<HTMLDialogElement>('.js-dialog')
  dialogs.forEach(dialog => {
    setUpDialogModal(dialog)
  })
}

dialogInit()
