/**
 * @param CollapseMediatorParams
 */
let count = 0;
const collapseMediator = ({ switcher, content, index }) => {
    let _status = 'closed';
    let animation = null;
    const animationOptions = { duration: 350, easing: 'ease-out' };
    let contentStyle;
    let defaultPaddingTop;
    let defaultPaddingBottom;
    const duration = switcher.dataset?.duration;
    animationOptions.duration = duration ? Number(duration) : animationOptions.duration;
    //- アクセシビリティサポート
    const controlId = content.id ? content.id : `collapse-${++count}`;
    content.id = controlId;
    switcher.setAttribute('aria-controls', controlId);
    //- padding の値を保持しておく
    contentStyle = getComputedStyle(content);
    defaultPaddingTop = contentStyle.getPropertyValue('padding-top');
    defaultPaddingBottom = contentStyle.getPropertyValue('padding-bottom');
    /**
     *
     */
    const open = () => {
        animation?.cancel();
        if (_status === 'closed') {
            content.removeAttribute('hidden');
            updateAriaAttrs(true);
        }
        const offsetHeight = content.offsetHeight;
        const paddingTop = toNumericValue(defaultPaddingTop);
        const paddingBottom = toNumericValue(defaultPaddingBottom);
        const toHeight = getContentHeight(offsetHeight, paddingTop, paddingBottom);
        // console.log(toHeight)
        animation = content.animate([
            getStartAnimationKeyframe(_status),
            { height: `${toHeight}px`, paddingTop: defaultPaddingTop, paddingBottom: defaultPaddingBottom },
        ], animationOptions);
        animation.onfinish = () => onEnd(true);
        _status = 'opening';
        emitEvent();
    };
    /**
     *
     */
    const close = () => {
        animation?.cancel();
        switcher.style.pointerEvents = 'none';
        animation = content.animate([getStartAnimationKeyframe(_status), { height: '0px', paddingTop: '0px', paddingBottom: '0px' }], animationOptions);
        animation.onfinish = () => onEnd(false);
        _status = 'closing';
        emitEvent();
    };
    /**
     *
     */
    const toggleOpen = () => {
        const shouldOpen = _status === 'closed' || _status === 'closing';
        shouldOpen ? open() : close();
    };
    /**
     *
     */
    const getStatus = () => _status;
    /**
     *
     */
    const toNumericValue = (value) => {
        const pattern = /[+\-.\d]+/g;
        const matched = value.match(pattern) ?? [0];
        return Number(matched[0]);
    };
    /**
     *
     */
    const getContentHeight = (offsetHeight, paddingTop = 0, paddingBottom = 0) => {
        const boxSizing = contentStyle.getPropertyValue('box-sizing');
        return boxSizing === 'content-box' ? offsetHeight - paddingTop - paddingBottom : offsetHeight;
    };
    /**
     * 開閉開始時の共通処理
     * アニメーションをキャンセルする前にスタイルの値を取得し、キャンセル後再設定する
     */
    const getStartAnimationKeyframe = (status) => {
        const isClosed = status === 'closed';
        const offsetHeight = content.offsetHeight;
        const paddingTop = isClosed ? 0 : toNumericValue(contentStyle.getPropertyValue('padding-top'));
        const paddingBottom = isClosed ? 0 : toNumericValue(contentStyle.getPropertyValue('padding-bottom'));
        const height = isClosed ? 0 : getContentHeight(offsetHeight, paddingTop, paddingBottom);
        return {
            height: `${height}px`,
            paddingTop: `${paddingTop}px`,
            paddingBottom: `${paddingBottom}px`,
        };
    };
    /**
     * 開閉完了時の処理
     */
    const onEnd = (isOpen) => {
        _status = isOpen ? 'open' : 'closed';
        if (_status === 'closed') {
            updateAriaAttrs(false);
            content.setAttribute('hidden', '');
        }
        switcher.style.pointerEvents = '';
        animation = null;
        emitEvent();
    };
    /**
     * ARIA 属性を更新
     */
    const updateAriaAttrs = (isOpen) => {
        switcher['ariaExpanded'] = isOpen.toString();
        content['ariaHidden'] = (!isOpen).toString();
    };
    /**
     *
     */
    const emitEvent = () => {
        const eventType = 'change';
        const eventOptions = { detail: { status: _status, index: index } };
        const event = new CustomEvent(eventType, eventOptions);
        // console.log(event)
        dispatchEvent(event);
    };
    (() => {
        const status = content.hidden ? 'closed' : 'open';
        updateAriaAttrs(status === 'open');
        switcher.addEventListener('click', toggleOpen);
    })();
    // return {
    //   close,
    //   getStatus,
    // }
};
export default collapseMediator;
