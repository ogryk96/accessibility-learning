"use strict";
const createCarousel = (options) => {
    const { carousel, duration = 5000 } = options;
    const carouselItemsContainer = carousel.querySelector('.carousel-items-container');
    const items = carousel.querySelectorAll('.carousel-item');
    const controls = carousel.querySelectorAll('[data-controls]');
    const previousNextButtons = carousel.querySelectorAll('[data-slide-controls]');
    let currentIndex = 0;
    let autoPlayID = null;
    let status = 'playing';
    let clickCount = 0;
    let ignoreHoverEvents = false;
    let ignoreFocusEvents = false;
    //- Animation Keyframes定義
    const fadeInKeyFrames = [{ opacity: 0 }, { opacity: 1 }];
    const fadeOutKeyFrames = [{ opacity: 1 }, { opacity: 0 }];
    const animationTiming = { duration: 1000, easing: 'ease-out' };
    const setAriaHidden = () => {
        items.forEach(item => (item.ariaHidden = item.classList.contains('active') ? 'false' : 'true'));
    };
    const fadeInNextSlide = () => {
        // console.log('fade in next slide')
        items[currentIndex].classList.add('active');
        setAriaHidden();
        const fadeInAnimation = items[currentIndex].animate(fadeInKeyFrames, animationTiming);
        fadeInAnimation.onfinish = () => {
            fadeInAnimation.onfinish = null;
        };
    };
    const fadeOutCurrentSlide = () => {
        // console.log('fade out prev slide')
        const fadeOutAnimation = items[currentIndex].animate(fadeOutKeyFrames, animationTiming);
        const prevCurrentIndex = currentIndex;
        fadeOutAnimation.onfinish = () => {
            // console.log(prevCurrentIndex)
            items[prevCurrentIndex].classList.remove('active');
            setAriaHidden();
            fadeOutAnimation.onfinish = null;
        };
    };
    const slideTo = (index) => {
        fadeOutCurrentSlide();
        currentIndex = index;
        fadeInNextSlide();
    };
    const nextSlide = () => slideTo((currentIndex + 1) % items.length);
    const previousSlide = () => slideTo((currentIndex - 1 + items.length) % items.length);
    const startAutoPlay = () => {
        status = 'playing';
        if (autoPlayID === null) {
            autoPlayID = setInterval(nextSlide, duration);
        }
        carouselItemsContainer?.setAttribute('aria-live', 'off');
    };
    const stopAutoPlay = () => {
        status = 'paused';
        clearInterval(autoPlayID ?? undefined);
        autoPlayID = null;
        carouselItemsContainer?.setAttribute('aria-live', 'polite');
    };
    const autoplayToggleButton = Array.from(controls).find(control => control.classList.contains('rotation'));
    const togglePlay = () => {
        status === 'playing' ? stopAutoPlay() : startAutoPlay();
        autoplayToggleButton.textContent = status === 'playing' ? '再生を停止する' : '再生する';
    };
    //- controlsクリックイベントハンドラー
    const onControlButtonClick = (event) => {
        const button = event.target;
        const actionMap = {
            previous: [previousSlide],
            next: [nextSlide],
            rotation: [togglePlay],
        };
        for (const [key, actions] of Object.entries(actionMap)) {
            // console.log([key, actions])
            const hasKey = button.classList.contains(key);
            if (hasKey) {
                actions.forEach(action => {
                    if (key === 'rotation') {
                        ++clickCount;
                        if (clickCount >= 1) {
                            console.log('１回以上クリックされました');
                            ignoreHoverEvents = true;
                            ignoreFocusEvents = true;
                        }
                    }
                    action();
                });
                break;
            }
        }
    };
    controls.forEach(control => control.addEventListener('click', onControlButtonClick));
    //- フォーカス制御
    const onFocusInAndOut = (event) => {
        const target = event.target;
        const isLinkFocused = target.closest('[data-link-focus]');
        if (isLinkFocused) {
            carouselItemsContainer?.classList.toggle('focus', event.type === 'focusin');
        }
        if (!ignoreFocusEvents) {
            event.type === 'focusin' ? stopAutoPlay() : startAutoPlay();
        }
    };
    const focusableElements = Array.from(items).map(item => item.querySelectorAll('a, button'));
    if (carouselItemsContainer !== null) {
        const elementsToFocus = [...previousNextButtons, carouselItemsContainer, ...focusableElements].flat();
        // console.log(elementsToFocus)
        elementsToFocus.forEach(element => {
            if (element instanceof HTMLElement) {
                element.addEventListener('focusin', onFocusInAndOut);
                element.addEventListener('focusout', onFocusInAndOut);
            }
        });
    }
    //- ホバー制御
    const onMouseOver = (event) => {
        const target = event.target;
        // console.log(ignoreHoverEvents)
        // console.log(status)
        if (!ignoreHoverEvents && target !== autoplayToggleButton) {
            stopAutoPlay();
            // console.log(status)
        }
    };
    const onMouseOut = (event) => {
        if (!ignoreHoverEvents) {
            const target = event.relatedTarget;
            // console.log(target)
            const isLeavingCarousel = !carousel.contains(target);
            const isFocusableElementFocused = document.activeElement && document.activeElement.closest('.carousel') === carousel;
            if (isLeavingCarousel && !isFocusableElementFocused) {
                startAutoPlay();
            }
        }
    };
    carousel.addEventListener('mouseover', onMouseOver);
    carousel.addEventListener('mouseout', onMouseOut);
    return {
        startAutoPlay,
        stopAutoPlay,
    };
};
const init = () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
        const carouselObject = createCarousel({
            carousel: carousel,
            duration: 6000,
        });
        carouselObject.startAutoPlay();
    });
};
init();
