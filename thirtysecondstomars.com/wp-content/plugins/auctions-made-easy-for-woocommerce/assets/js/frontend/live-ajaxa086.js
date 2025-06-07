/* global ans_live_ajax_params */

jQuery( function ( $ ) {
	'use strict' ;

	/**
	 * Block a node visually for processing.
	 *
	 **/
	var block = function ( $node ) {
		if ( !is_blocked( $node ) ) {
			$node.addClass( 'processing' ).block( {
				message : null ,
				overlayCSS : {
					background : '#fff' ,
					opacity : 0.6
				}
			} ) ;
		}
	} ;

	/**
	 * Check if a node is blocked for processing.
	 *
	 **/
	var is_blocked = function ( $node ) {
		return $node.is( '.processing' ) || $node.parents( '.processing' ).length ;
	} ;

	/**
	 * Shows new notices on the page.
	 *    
	 **/
	var show_notice = function ( html_element , $target ) {
		if ( !$target ) {
			$target = $( '.woocommerce-notices-wrapper:first' ) ;
		}
		$target.prepend( html_element ) ;
	} ;

	/**
	 * Update page.
	 * 
	 **/
	var update_live_page = function ( html_str ) {

		var $html = $.parseHTML( html_str ) ,
				$last_activity = $( '#ans_auction_last_activity' ).val() ,
				$current_auction_product = $( '.ans-auction-product-summary' , $html ) ,
				$current_log_wrapper = $( '.ans-bid-logs-wrapper' , $html ) ,
				$current_my_log_wrapper = $( '.ans-my-bid-logs-wrapper' , $html ) ,
				$price = $( 'p.price' , $html ) ,
				$notices = $( '.woocommerce-error, .woocommerce-message, .woocommerce-info' , $html ) ,
				$current_last_activity = $( '#ans_auction_last_activity' , $html ).val() ;

		if ( $last_activity >= $current_last_activity ) {
			return ;
		}

		var $auction_product = $( '.ans-auction-product-summary' ) ,
				$log_wrapper = $( '.ans-bid-logs-wrapper' ) ;

		// Live update auction page.
		block( $auction_product ) ;
		block( $log_wrapper ) ;

		// Remove Woocommerce Notices. 
		$( '.woocommerce-error, .woocommerce-message, .woocommerce-info' ).remove() ;

		$( '.ans-auction-product-summary' ).replaceWith( $current_auction_product ) ;
		$( 'p.price' ).replaceWith( $price ) ;
		$( '.ans-bid-logs-wrapper' ).replaceWith( $current_log_wrapper ) ;
		$( '.ans-my-bid-logs-wrapper' ).replaceWith( $current_my_log_wrapper ) ;

		$( document.body ).trigger( 'ans-countdown-timer-init' ) ;

		show_notice( $notices ) ;
	} ;


	/**
	 * Unblock a node after processing is complete.
	 *
	 **/
	var unblock = function ( $node ) {
		$node.removeClass( 'processing' ).unblock() ;
	} ;

	var $auction_product = $( '.ans-auction-product-summary' ) ;

	if ( 'yes' == ans_live_ajax_params.live_ajax_enabled && ans_live_ajax_params.interval && $auction_product.length ) {
		var window_focus = true ;

		if ( 'yes' == ans_live_ajax_params.only_focus ) {
			$( window ).on( 'focusin' , function () {
				window_focus = true ;
			} ).on( 'focusout' , function () {
				window_focus = false ;
			} ) ;
		}

		var interval = setInterval( function ( ) {
			if ( !window_focus ) {
				return ;
			}

			var $form = $( '.ans-auction-form' ) ,
					$log_wrapper = $( '.ans-bid-logs-wrapper' ) ;

			// Make call to actual form post URL.
			$.ajax( {
				type : $form.attr( 'method' ) ,
				url : $form.attr( 'action' ) ,
				dataType : 'html' ,
				success : function ( response ) {
					update_live_page( response ) ;
				} ,
				complete : function () {

					unblock( $auction_product ) ;
					unblock( $log_wrapper ) ;
				}
			} ) ;
		} , ans_live_ajax_params.interval * 1000 ) ;
	}

	if ( 'yes' == ans_live_ajax_params.reload_page_enabled ) {

		$( '.ans_auction_reload_auction_page' )
				.on( 'click' , function () {

					var $form = $( '.ans-auction-form' ) ,
							$log_wrapper = $( '.ans-bid-logs-wrapper' ) ;

					// Live update auction page.
					block( $auction_product ) ;
					block( $log_wrapper ) ;

					// Make call to actual form post URL.
					$.ajax( {
						type : $form.attr( 'method' ) ,
						url : $form.attr( 'action' ) ,
						dataType : 'html' ,
						success : function ( response ) {
							update_live_page( response ) ;
						} ,
						complete : function () {

							unblock( $auction_product ) ;
							unblock( $log_wrapper ) ;
						}
					} ) ;
				} ) ;
	}

} ) ;
