;(function ($) {
    $.fn.heroSlider = function (userOptions) {
        // User Configurable Options
        var options = $.extend({
            slideContainer: '.hero-slide',      // The name of the slide class
            animationTime: 1000,                // The time it takes to complete the transition animation in milliseconds
            slideDelay: 3000,                   // The amount of time it will show each slide in milliseconds
            autoScroll: 1,                      // If slides should automatically scroll by default
            loop: 1                             // If you should be able to go from last to first and vice versa
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
                autoScroll = options.autoScroll,
                slides = $heroSlider.children(),
                slideWidth = $heroSlider.width(),
                slideHeight = $heroSlider.height(),
                slideWrapper,
                delayTimer,
                nextButton,
                previousButton;

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
                    'overflow': 'hidden'
                }).wrapInner('<div class="hs-slider-slide-wrapper" />');

                slideWrapper = $heroSlider.find('.hs-slider-slide-wrapper');
                // Apply some needed styles to the wrapper
                $heroSlider.setWrapperCSS();
                //$heroSlider.resetWrapperPosition();

                // Set the css for the slides
                $heroSlider.setSlideCSS();

                // Add the previous button
                $heroSlider.append('<div id="hs-previous-button" />');
                previousButton = $heroSlider.find('#hs-previous-button');
                // Set the css for the previous button
                $heroSlider.setPreviousButtonCSS();

                // Add the next button
                $heroSlider.append('<div id="hs-next-button" />');
                nextButton = $heroSlider.find('#hs-next-button');
                // Set the css for the prev button
                $heroSlider.setNextButtonCSS();

                // Bind the hover events for the carousel
                $heroSlider.hover($heroSlider.showNav, $heroSlider.hideNav);

                // Bind the click events for the buttons
                nextButton.click(function () {
                    autoScroll = 0;
                    $heroSlider.nextSlide();
                });

                previousButton.click(function () {
                    autoScroll = 0;
                    $heroSlider.previousSlide();
                });

                // Initialize the timer
                $heroSlider.resetTimer();
            };

            // Timer Expiry
            $heroSlider.timerFinished = function () {
                $heroSlider.nextSlide();
            };

            // Reset Timer
            $heroSlider.resetTimer = function () {
                delayTimer = setInterval($heroSlider.timerFinished, options.slideDelay);
            };

            // Show Navigation
            $heroSlider.showNav = function () {
                previousButton.stop(true, true).fadeIn('fast');
                nextButton.stop(true, true).fadeIn('fast');
            };

            // Hide Navigation
            $heroSlider.hideNav = function () {
                previousButton.stop(true, true).fadeOut('fast');
                nextButton.stop(true, true).fadeOut('fast');
            };

            // Next Slide
            $heroSlider.nextSlide = function () {
                currentSlide = currentSlide + 1;
                if (currentSlide > slideCount) {
                    currentSlide = 1;
                }
                $heroSlider.changeSlide(slides.eq(currentSlide - 1));
                clearInterval(delayTimer);
            };

            // Previous Slide
            $heroSlider.previousSlide = function () {
                currentSlide = currentSlide - 1;
                if (currentSlide < 1) {
                    currentSlide = slideCount;
                }
                $heroSlider.changeSlide(slides.eq(currentSlide - 1));
                clearInterval(delayTimer);
            };

            // Change a slide
            $heroSlider.changeSlide = function (destinationSlide) {
                var pos = destinationSlide.position();
                slideWrapper.stop().animate({left: -pos.left}, options.animationTime, 'swing', function () {
                    if (autoScroll) {
                        $heroSlider.resetTimer();
                    }
                });
            };

            // Set the css for the slides themselves
            $heroSlider.setSlideCSS = function () {
                slideWidth = $heroSlider.width();
                slideHeight = $heroSlider.height();

                // Apply the slides CSS
                slides.css({
                    'height': slideHeight,
                    'width': slideWidth,
                    'position': 'relative',
                    'float': 'left'
                });

                slideWidth = $heroSlider.width();
                slideHeight = $heroSlider.height();
            };

            // Set the CSS for the Wrapper
            $heroSlider.setWrapperCSS = function () {
                slideWrapper.css({
                    'height': slideHeight,
                    'width': slideWidth * slideCount,
                    'position': 'relative',
                    'float': 'left',
                    'left': -((currentSlide - 1) * slideWidth)
                });
            };

            // Resets the slides to slide one, we don't want to do this every resize
            $heroSlider.resetWrapperPosition = function () {
                slideWrapper.css({'left': '0px'});
            };

            // Set the CSS for the next button
            $heroSlider.setNextButtonCSS = function () {
                nextButton.css({
                    'margin-left': -(slideWidth * slideCount) + (slideWidth - nextButton.width()),
                    'display': 'none'
                });
            };

            // Set the CSS for the previous button
            $heroSlider.setPreviousButtonCSS = function () {
                previousButton.css({
                    'margin-left': -(slideWidth * slideCount),
                    'display': 'none'
                });
            };

            // Resize the slides on window size changing
            $(window).resize(function () {
                $heroSlider.setSlideCSS();
                $heroSlider.setWrapperCSS();
                $heroSlider.setPreviousButtonCSS();
                $heroSlider.setNextButtonCSS();
            });

            // Spin it up!
            $heroSlider.init();
        });
    };
})(jQuery);
