window.APP = window.APP || {};

APP.Slider = (function() {

    var defaultConfig = {
        initialSlide: 0
    }

    function Slider(frame, slider, config) {
        this.$frame = $(frame);
        this.$slider= $(slider);
        this.$slides = this.$slider.find('.slide');
        this.$sliderCtrl = this.$frame.find('.slider-controls');
        this.noOfSlides = this.$slides.length;
        this.frameWidth = this.$frame.innerWidth();
        this.wheelDelta = 0;
        this.offsetX;

        if (config && (typeof config === 'object')) {
            this.config = $.extend({}, defaultConfig, config);
        } else {
            this.config = defaultConfig;
        }

        this.currSlide = parseInt(this.config.initialSlide);
        this.initSlider();
        this.initDOMEvents();
    }

    Slider.prototype.initSlider = function() {
        this.styleSlider();
        this.setActiveSlide(this.currSlide);
        _initAnimation(this.$slider);
    }

    Slider.prototype.styleSlider = function() {
        var sliderWidth = this.frameWidth * this.noOfSlides;
        this.$slides.css({
            width: this.frameWidth,
            float: 'left'          
        });
        this.$slider.addClass('clearfix').css({
            position: 'relative',
            width: sliderWidth
        });
        this.$frame.css('overflow', 'hidden');
    }

    Slider.prototype.setActiveSlide = function(slideIdx) {
        var leftPos = this.frameWidth * slideIdx;
        if (slideIdx >= this.noOfSlides) {
            leftPos = 0;
        }
        this.$slider.css('left' , -leftPos);
        _setActiveClass(this.$slides, slideIdx);
        _checkSliderCtrl(slideIdx, this.noOfSlides, this.$sliderCtrl);
    }

    Slider.prototype.initDOMEvents = function() {
        this.$sliderCtrl.find('.next-slide').off('click').on('click', (function() {
            this.nextSlide();
        }).bind(this));

        this.$sliderCtrl.find('.prev-slide').off('click').on('click', (function() {
            this.prevSlide();
        }).bind(this));

        this.$slides.off('wheel').on('wheel', (function(event) {
            event.preventDefault();
            this.zoomSlide(event);
        }).bind(this));

        this.$slides.off('dragstart').on('dragstart', (function(event) {
            this.offsetX = event.clientX;
        }).bind(this));

        this.$slides.off('dragend').on('dragend', (function(event) {
            var offsetDiff = this.offsetX - event.clientX;
            if (offsetDiff < 0 && this.currSlide !== 0) {
                this.prevSlide();
            } else if (offsetDiff > 0 && this.currSlide !== this.noOfSlides -1){
                this.nextSlide();
            }
        }).bind(this));
    }

    Slider.prototype.nextSlide = function() {
        this.currSlide++;
        this.resetZoom();
        this.setActiveSlide(this.currSlide);
    }

    Slider.prototype.prevSlide = function() {
        this.currSlide--;
        this.resetZoom();
        this.setActiveSlide(this.currSlide);
    }

    Slider.prototype.zoomSlide = function(event) {
        var scaleTo = 1;
        if (event.originalEvent.deltaY < 0) {
            this.wheelDelta += 0.1;
            this.wheelDelta >= 1 ? this.wheelDelta -= 0.1 : '';
        } else {
            this.wheelDelta -= 0.1;
            this.wheelDelta < 0 ? this.wheelDelta += 0.1 : '';
        }        
        scaleTo += this.wheelDelta;
        $(event.delegateTarget).css('transform', 'scale(' + scaleTo + ')');
    }

    Slider.prototype.resetZoom = function() {
        this.$slides.css('transform', 'scale(1)');
    }

    function _setActiveClass($slides, index) {
        $slides
        .removeClass('active')
        .eq(index)
        .addClass('active');
    }

    function _checkSliderCtrl(index, noOfSlides, $sliderCtrl) {
        $sliderCtrl.find('button').removeClass('disabled');
        if (index === noOfSlides-1) {
            $sliderCtrl.find('.next-slide').addClass('disabled');
        }
        if (index === 0) {
            $sliderCtrl.find('.prev-slide').addClass('disabled');
        }
    }

    function _initAnimation($slider) {
        $slider.css({
            'transition': 'all 1s',
            '-webkit-transition': 'all 1s',
            '-moz-transition': 'all 1s',
            '-o-transition': 'all 1s'
        })
    }

    return Slider;

})();

var slider = new APP.Slider('.frame', '.slider');