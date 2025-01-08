/**
 *
 * @param TabMediatorParam
 * @return tabMediatorオブジェクト
 */
const tabMediator = ({ switchers, contents }) => {
    let selectedIndex = switchers.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
    /** タブ選択 */
    const select = (index) => {
        if (index !== selectedIndex) {
            switchers[selectedIndex].setAttribute('aria-selected', 'false');
            switchers[selectedIndex].tabIndex = -1;
            contents[selectedIndex].setAttribute('hidden', '');
            switchers[index].setAttribute('aria-selected', 'true');
            switchers[index].removeAttribute('tabindex');
            contents[index].removeAttribute('hidden');
            selectedIndex = index;
        }
    };
    /** イベントの後処理 */
    const dispose = () => {
        switchers.forEach(tab => {
            tab.removeEventListener('click', onTabClick);
            tab.removeEventListener('keydown', onKeyDown);
        });
    };
    /** clickイベントハンドラー */
    const onTabClick = (event) => {
        const nextIndex = switchers.findIndex(el => el === event.currentTarget);
        select(nextIndex);
    };
    /** keydownイベントハンドラー */
    const onKeyDown = (event) => {
        const target = event.currentTarget;
        const targetIndex = switchers.indexOf(target);
        // フォーカスすべきタブ要素を取得する
        const tabToFocus = ((key) => {
            const lastTab = switchers.slice(-1)[0];
            const firstTab = switchers[0];
            switch (key) {
                case 'ArrowLeft':
                    return switchers[targetIndex - 1] ?? lastTab;
                case 'ArrowRight':
                    return switchers[targetIndex + 1] ?? firstTab;
                case 'Home':
                    return firstTab;
                case 'End':
                    return lastTab;
                default:
                    return null;
            }
        })(event.key);
        if (tabToFocus) {
            event.stopPropagation();
            event.preventDefault();
            tabToFocus.focus();
        }
    };
    (() => {
        switchers.forEach(switcher => {
            switcher.addEventListener('click', onTabClick);
            switcher.addEventListener('keydown', onKeyDown);
        });
    })();
    return {
        select,
        selectedIndex,
        dispose,
    };
};
export default tabMediator;
