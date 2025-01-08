import collapseMediator from './collapse-mediator.js'

const create = () => {
  const collapses = document.querySelectorAll<HTMLElement>('.js-collapse')

  return Array.from(collapses).map(container => {
    const switchers = Array.from(container.querySelectorAll<HTMLElement>('.js-collapse-switcher'))
    const contents = Array.from(container.querySelectorAll<HTMLElement>('.js-collapse-content'))
    const collapseMediators = switchers.map((switcher, index) => {
      const mediator = collapseMediator({
        switcher,
        content: contents[index],
        index,
      })

      return mediator
    })

    return collapseMediators
  })
}

export default {
  create,
}
