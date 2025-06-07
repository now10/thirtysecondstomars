(function($){
	'use strict';

	$(document).ready(function(){

		/* = Product Page
		---------------------------------------------------- */

		$('.woocommerce').on('click', '.product-purchase-option', function(){

			if ($(this).hasClass('active')) {
				return;
			}

			// switch classes
			$(this).siblings().removeClass('active');
			$(this).addClass('active');

		});

		$('.woocommerce').on('click', '.product-purchase-option .subscription-option-selected', function(){
			$(this).toggleClass('clicked');
		});

		$('.woocommerce').on('click', '.product-purchase-option .subscription-suboptions li', function(){

			// switch classes
			$(this).siblings().removeClass('active');
			$(this).addClass('active');

			// update parent option
			$('.product-purchase-option.subscription-option input').attr('data-custom_data', $(this).attr('data-custom_data'));
			$('.product-purchase-option.subscription-option input').val($(this).attr('data-value'));

			$('.product-purchase-option.subscription-option label .product-purchase-option-price')
				.html($(this).find('.product-purchase-option-price').html());

			$('.product-purchase-option.subscription-option .subscription-option-selected')
				.html($(this).find('.product-purchase-option-label').html());

			// close
			$('.product-purchase-option .subscription-option-selected').removeClass('clicked');

		});

		$('html').click(function(e){

			if ($('.product-purchase-option .subscription-option-selected.clicked').length) {

				if (!$(e.target).hasClass('subscription-suboptions') &&
					 !$(e.target).closest('.subscription-suboptions').length &&
					 !$(e.target).hasClass('subscription-option-selected')) {

					$('.product-purchase-option .subscription-option-selected').removeClass('clicked');
				}
			}
		});

		/* = Cart Page
		---------------------------------------------------- */

		$('.woocommerce').on('change', '.product-payment-plan-options input', function(){

			var options = $(this).closest('.product-payment-plan-options').find('input');

			var checked = $(this).prop('checked');
			var value = $(this).val();

			if (checked) {
				options.each(function(){

					// uncheck other payment plans
					if ($(this).val() != value) {
						$(this).prop('checked', false);
					}

				});
			}

			else {

				// check the last one (full-payment)
				$(options).last().prop('checked', true);
			}

			$('.woocommerce button[name="update_cart"]').trigger('click');

		});

	});

})(jQuery);
