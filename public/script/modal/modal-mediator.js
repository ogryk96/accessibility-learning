/**
 *
 */
const modalMediator = ({ opener, content, overlay, backgroundElement, focusableElements }) => {
    let lastFocusedElement;
    /** モーダル開く */
    const open = (event) => {
        event.preventDefault();
        content?.classList.add('is-open');
        content?.removeAttribute('hidden');
        backgroundElement.inert = true;
        // モーダルに移動する前にフォーカスしたbuttonを取得
        lastFocusedElement = document.activeElement;
        // モーダルを開いた時のフォーカス制御
        content?.focus();
        const firstFocusElement = content?.querySelector('[data-focus-primary]');
        firstFocusElement?.focus();
        overlay?.addEventListener('click', event => {
            if (event.target === overlay)
                onClose();
        });
        setCloserListeners(true);
    };
    /** モーダル閉じる */
    const close = (event) => {
        event.preventDefault();
        content?.classList.remove('is-open');
        backgroundElement.inert = false;
        // モーダルに移動する前にフォーカスしたbuttonにフォーカスを戻す
        lastFocusedElement?.focus();
        // イベント後処理
        content?.removeEventListener('animationend', { handleEvent: close });
        overlay?.removeEventListener('animationend', { handleEvent: close });
        setOpenerListeners(false);
        setCloserListeners(false);
        setOpenerListeners(true);
    };
    const onClose = () => {
        content?.setAttribute('hidden', '');
        overlay?.addEventListener('animationend', { handleEvent: close }, { once: true });
        content?.addEventListener('animationend', { handleEvent: close }, { once: true });
    };
    /** keyupイベントハンドラー */
    const onKeyUp = (event) => {
        event.preventDefault();
        if (event.key === 'Escape')
            onClose();
    };
    /** keydownイベントハンドラー */
    const onKeyDown = (event) => {
        const activeIndex = focusableElements?.findIndex(el => el === document.activeElement) ?? 0;
        if (focusableElements) {
            const elementToFocus = (event => {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements.slice(-1)[0];
                const tabKey = event.key === 'Tab';
                const shiftKey = event.shiftKey;
                const shouldFocusNext = !shiftKey && tabKey;
                const shouldFocusPrev = shiftKey && tabKey;
                switch (true) {
                    case shouldFocusNext:
                        return focusableElements[activeIndex + 1] ?? firstElement;
                    case shouldFocusPrev:
                        return focusableElements[activeIndex - 1] ?? lastElement;
                    default:
                        break;
                }
            })(event);
            if (elementToFocus) {
                event.preventDefault();
                elementToFocus.focus();
            }
        }
    };
    /**
     *
     * @param shouldSet
     */
    const closers = content?.querySelectorAll('[data-modal-close]') ?? [];
    const setCloserListeners = (shouldSet) => {
        closers.forEach(closer => {
            closer.removeEventListener('click', onClose);
            if (shouldSet)
                closer.addEventListener('click', onClose, { once: true });
        });
    };
    /**
     *
     * @param shouldSet
     */
    const setOpenerListeners = (shouldSet) => {
        opener.removeEventListener('click', open);
        if (shouldSet)
            opener.addEventListener('click', open, { once: true });
    };
    (() => {
        opener?.addEventListener('click', open);
        content?.addEventListener('keyup', onKeyUp);
        content?.addEventListener('keydown', onKeyDown);
    })();
};
export default modalMediator;
