import tabMediator from './tab-mediator.js';
const create = () => {
    const switcherQuerySelector = '.tab__switcher[role=tab]';
    const contentQuerySelector = '.tab__content[role=tabpanel]';
    const tabMediators = Array.from(document.querySelectorAll('.tab')).map(tab => {
        const switchers = tab.querySelectorAll(switcherQuerySelector);
        const contents = tab.querySelectorAll(contentQuerySelector);
        return tabMediator({
            switchers: Array.from(switchers),
            contents: Array.from(contents),
        });
    });
    return tabMediators;
};
export default {
    create,
};
