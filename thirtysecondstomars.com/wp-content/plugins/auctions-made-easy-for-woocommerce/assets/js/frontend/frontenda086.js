/* global ans_frontend_params */

jQuery(function ($) {
	'use strict';

	var ANS_Frontend = {
		init: function ( ) {
			$(document).on('click', '.ans-auction-add-watchlist', this.add_to_watchlist);
			$(document).on('click', '.ans-auction-remove-watchlist', this.remove_from_watchlist);
			$(document).on('click', '.ans-send-private-message', this.send_private_message);
			$(document).on('click', 'span.ans-bid-increment', this.bid_increment);
			$(document).on('click', 'span.ans-bid-decrement', this.bid_decrement);
			$(document).on('change', '.ans-auction-bid-increment', this.validate_bid_value);
			$(document).on('click', '.ans-auction-remove-watchlist-entry', this.confirm_box);
			$(document).on('click', '.ans-delete-auction-bid', this.delete_bid);
			// Search list table auction products.
			$(document).on('click', '.ans-auction-list-table-search-btn', this.search_list_table_auction_products);
			$(document).on('click', '.ans-auction-catalog-place-bid', this.process_bid_now);
			$(document).on('click', '.ans-auction-catalog-buy-now', this.process_buy_now);

			if (ans_frontend_params.enable_alert_bid_message === 'yes') {
				$(document).on('click', '.ans-auction-bid', this.alert_message_before_bid_submit);
			}
		}, process_bid_now: function (event) {
			event.preventDefault();
			var bid_amount = Number($('.ans-auction-bid-increment').val());
			var product_id = $(this).data('product_id');

			var data = ({
				action: 'ans_process_bid_now',
				product_id: product_id,
				bid_amount: bid_amount,
				ans_security: ans_frontend_params.ans_auction_nonce
			});

			$.post(ans_frontend_params.ajaxurl, data, function (res) {
				window.location.reload();
			});
		}, process_buy_now: function (event) {
			event.preventDefault();
			var product_id = $(this).data('product_id');

			var data = ({
				action: 'ans_process_buy_now',
				product_id: product_id,
				ans_security: ans_frontend_params.ans_auction_nonce
			});

			$.post(ans_frontend_params.ajaxurl, data, function (res) {
					window.location.href = res.data.url;
			});
		}, search_list_table_auction_products: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget),
					wrapper = $this.closest('.ans-auction-product-list-table-wrapper');

			ANS_Frontend.block(wrapper);
			var data = ({
				action: 'ans_search_list_table_auction_products',
				s: wrapper.find('.ans-auction-list-table-search').val(),
				sortby: wrapper.find('.ans-auction-list-table-sortby').val(),
				hide: wrapper.find('.ans-auction-list-table-hide').val(),
				paginate: wrapper.find('.ans-auction-list-table-paginate').val(),
				orderby: wrapper.find('.ans-auction-list-table-orderby').val(),
				order: wrapper.find('.ans-auction-list-table-order').val(),
				per_page: wrapper.find('.ans-auction-list-table-per-page').val(),
				ans_security: ans_frontend_params.search_nonce
			});
			$.post(ans_frontend_params.ajaxurl, data, function (res) {
				if (true === res.success) {
					wrapper.replaceWith(res.data.html);
				} else {
					alert(res.data.error);
				}

				ANS_Frontend.unblock(wrapper);
			});
		}, add_to_watchlist: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			ANS_Frontend.block($this);

			var data = ({
				action: 'ans_add_to_watchlist',
				product_id: $this.val(),
				ans_security: ans_frontend_params.ans_watchlist_nonce,
			});

			$.post(ans_frontend_params.ajaxurl, data, function (res) {
				if (true === res.success) {
					$('div.ans-auction-watchlist-btn').html(res.data.html);
				} else {
					alert(res.data.error);
				}
				ANS_Frontend.unblock($this);
			}
			);
		}, remove_from_watchlist: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			ANS_Frontend.block($this);

			var data = ({
				action: 'ans_remove_from_watchlist',
				product_id: $this.val(),
				ans_security: ans_frontend_params.ans_watchlist_nonce,
			});

			$.post(ans_frontend_params.ajaxurl, data, function (res) {
				if (true === res.success) {
					$('div.ans-auction-watchlist-btn').html(res.data.html);
				} else {
					alert(res.data.error);
				}
				ANS_Frontend.unblock($this);
			}
			);
		}, send_private_message: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget);

			var $message_wrapper = $($this).closest('.ans-private-message-wrapper');
			ANS_Frontend.block($message_wrapper);

			var data = ({
				action: 'ans_send_private_message',
				message: $message_wrapper.find('#ans_private_message_message').val(),
				ans_security: ans_frontend_params.ans_private_message_nonce,
			});

			$.post(ans_frontend_params.ajaxurl, data, function (res) {
				if (true === res.success) {
					alert(res.data.msg);
					$message_wrapper.find('#ans_private_message_message').val('')
				} else {
					alert(res.data.error);
				}

				ANS_Frontend.unblock($message_wrapper);
			}
			);
		}, alert_message_before_bid_submit: function (event) {

			if (false === confirm(ans_frontend_params.bid_confirm_message)) {
				return false;
			}
		}, bid_increment: function (event) {
			event.preventDefault();
			var current_val = Number($('.ans-auction-bid-increment').val());
			var maximum = Number($('.ans-auction-bid-increment').attr('max'));
			var amount = Number($('.ans-auction-bid-increment').data('attr'));
			var result = current_val + amount;

			if (result <= maximum || '0' == maximum) {
				$('.ans-auction-bid-increment').val(result);
			}

		}, bid_decrement: function (event) {
			event.preventDefault();
			var current_val = Number($('.ans-auction-bid-increment').val());
			var minimum = Number($('.ans-auction-bid-increment').attr('min'));
			var amount = Number($('.ans-auction-bid-increment').data('attr'));
			var result = current_val - amount;

			if ('0' <= result && result >= minimum) {
				$('.ans-auction-bid-increment').val(result);
			}

		}, validate_bid_value: function (event) {
			event.preventDefault();

			if ('2' != $(this).data('type')) {
				return false;
			}

			var regex = new RegExp('[^\-0-9\%\\' + ans_frontend_params.ans_decimal_point + ']+', 'gi'),
					value = $(this).val(),
					newvalue = value.replace(regex, '');

			if (value !== newvalue) {
				$(this).val(newvalue);
			}

		}, confirm_box: function (event) {
			var message = confirm(ans_frontend_params.ans_confirm_message);

			if (!message) {
				event.preventDefault();
				return;
			}

		}, delete_bid: function (event) {
			event.preventDefault();
			var $this = $(event.currentTarget),
					wrapper = $($this).closest('.ans-bid-logs-wrapper');

			if (!confirm(ans_frontend_params.delete_bid_confirm_message)) {
				return false;
			}

			ANS_Frontend.block(wrapper);

			var data = ({
				action: 'ans_delete_auction_bid',
				bid_id: $this.data('bid_id'),
				ans_security: ans_frontend_params.ans_delete_bid_nonce,
			});

			$.post(ans_frontend_params.ajaxurl, data, function (res) {
				if (true === res.success) {
					alert(res.data.msg);
					window.location.reload();
				} else {
					alert(res.data.error);
				}
				ANS_Frontend.unblock(wrapper);
			}
			);
		},
		block: function (id) {
			$(id).block({
				message: null,
				overlayCSS: {
					background: '#fff',
					opacity: 0.7
				}
			});
		}, unblock: function (id) {
			$(id).unblock();
		},
	};
	ANS_Frontend.init( );
});
