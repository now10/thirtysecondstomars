
jQuery(function ($) {
	'use strict';

	try {
		$(document.body).on('ans-countdown-timer-init', function () {
			var $countdown_timer = $('.ans-auction-countdown-timer');

			if ($countdown_timer.length) {
				$('.ans-auction-countdown-timer').each(function () {
					var $timer = $(this);
					var interval = setInterval(function () {
						var d = new Date(),
							utc = d.getTime() + (d.getTimezoneOffset() * 60000),
							now = new Date(utc),
							end_date = new Date($timer.data('time')).getTime(),
							distance = end_date - now.getTime();

						if (distance < 0) {
							//Clear interval.
							clearInterval(interval);
							//After completed the timer reload the page.
							if ($timer.data('reload')) {
								window.location.reload(true);
							}

							return;
						}

						var days = Math.floor(distance / (1000 * 60 * 60 * 24));
						var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
						var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
						var seconds = Math.floor((distance % (1000 * 60)) / 1000);

						$timer.find('#ans_auction_days').html(days);
						$timer.find('#ans_auction_hours').html(hours);
						$timer.find('#ans_auction_minutes').html(minutes);
						$timer.find('#ans_auction_seconds').html(seconds);
					}, 1000);
				});
			}
		});

		$(document.body).trigger('ans-countdown-timer-init');
	} catch (err) {
		window.console.log(err);
	}
});
