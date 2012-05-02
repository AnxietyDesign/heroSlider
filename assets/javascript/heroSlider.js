;(function ($) {
    $.fn.heroSlider = function (userOptions) {
        // User Configurable Options
        var options = $.extend({
            slideContainer: '.heroSlide'
        }, userOptions),

            // Non customizable variables
            // Modifying these may result in unexpected behaviour
            slideCount = 0,
            currentSlide = 1,
            isFailure = 0,          // Is it MSIE?
            isAnimateFailure = 0;   // Is it MSIE 6!?

        return this.each(function () {
            // Always use protection
            var $heroSlider = $(this),
                slides = $heroSlider.children(),
                sliderWidth = slides.width(),
                sliderHeight = slides.height(),
                slideWrapper;

            // Methods
            // Initialize
            $heroSlider.init = function () {
                // Check if we are dealing with a pathetic browser
                if ($.browser.msie) {
                    isFailure = 1;
                    if (parseFloat($.browser.version) < 7.0) {
                        isAnimateFailure = 1;
                    }
                }

                // Figure out how many slides we are using
                slideCount = ($heroSlider.find(options.slideContainer)).length;

                // Apply the slider css and wrap all the slides inside
                $heroSlider.css({
                    'width': sliderWidth,
                    'height': sliderHeight,
                    'overflow': 'hidden'
                }).wrapInner('<div class="heroSliderSlideWrapper" />');

                slideWrapper = $heroSlider.find('.heroSliderSlideWrapper');

                // Apply the slides CSS
                slides.css({
                    'position': 'relative',
                    'float': 'left'
                });
            };

            // Change a slide
            $heroSlider.changeSlide = function (destinationSlide) {
                var pos = destinationSlide.position();
                console.log(slideWrapper);
                slideWrapper.animate({left: pos.left}, 5000, 'swing');
            };

            // Spin it up!
            $heroSlider.init();
            $heroSlider.changeSlide(slides.last());
        });
    };
})(jQuery);
