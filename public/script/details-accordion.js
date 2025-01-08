"use strict";
const animationOptions = {
    duration: 250,
    easing: 'ease-out',
};
const createDetailsAccordion = ({ accordion, summary, content }) => {
    let _status = 'closed';
    let animation = null;
    let contentStyle;
    let defaultPaddingTop;
    let defaultPaddingBottom;
    const IS_ANIMATING = 'animating';
    //- padding の値を保持しておく
    contentStyle = getComputedStyle(content);
    defaultPaddingTop = contentStyle.getPropertyValue('padding-top');
    defaultPaddingBottom = contentStyle.getPropertyValue('padding-bottom');
    summary?.addEventListener('click', event => {
        event.preventDefault();
        if (accordion.open) {
            animation?.cancel();
            // console.log(_status)
            animation = content.animate([getStartAnimationKeyframe(_status), { height: '0px', paddingTop: '0px', paddingBottom: '0px' }], animationOptions);
            accordion.dataset.status = IS_ANIMATING;
            animation.onfinish = () => {
                accordion.removeAttribute('open');
                accordion.dataset.status = '';
                animation = null;
            };
            _status = 'closed';
        }
        else {
            animation?.cancel();
            // console.log(_status)
            if (_status === 'closed') {
                accordion.setAttribute('open', 'true');
            }
            const offsetHeight = content.offsetHeight;
            const paddingTop = toNumericValue(defaultPaddingTop);
            const paddingBottom = toNumericValue(defaultPaddingBottom);
            const toHeight = getContentHeight(offsetHeight, paddingTop, paddingBottom);
            animation = content.animate([
                getStartAnimationKeyframe(_status),
                { height: `${toHeight}px`, paddingTop: defaultPaddingTop, paddingBottom: defaultPaddingBottom },
            ], animationOptions);
            accordion.dataset.status = IS_ANIMATING;
            animation.onfinish = () => {
                accordion.dataset.status = '';
                animation = null;
            };
            _status = 'open';
        }
    });
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
        const offsetHeight = content?.offsetHeight;
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
     *
     */
    const toNumericValue = (value) => {
        const pattern = /[+\-.\d]+/g;
        const matched = value.match(pattern) ?? [0];
        return Number(matched[0]);
    };
};
const detailsAccordionInit = () => {
    const detailsAccordion = document.querySelectorAll('.js-details');
    detailsAccordion.forEach(accordion => {
        const summary = accordion.querySelector('.js-summary');
        const content = accordion.querySelector('.js-details-content');
        createDetailsAccordion({
            accordion: accordion,
            summary: summary,
            content: content,
        });
    });
};
detailsAccordionInit();
