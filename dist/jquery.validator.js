/*
 *  jquery-boilerplate - v3.4.0
 *  A jump-start for jQuery plugins development.
 *  http://jqueryboilerplate.com
 *
 *  Made by Zeno Rocha
 *  Under MIT License
 */

;(function ( $, window, document, undefined ) {

	"use strict";

	var pluginName = "quickValidate",
			defaults = {
	};

	function Plugin ( element, options ) {
			this.element = element;
			this.settings = $.extend( {}, defaults, options );
			this._defaults = defaults;
			this._name = pluginName;

			this.init();
	}

	$.extend(Plugin.prototype, {
		init: function () {
			var $form = this;
			var $inputs = $($form.element).find('input:text, input:password, input:checkbox');

			var filters = {
				username: {
					regex: /^[a-z0-9_-]{3,15}$/,
					error: 'Must be  3 to 15 characters with any lower case character, digit or special symbol _- only'
				},
				password: {
					regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{4,8}$/,
					error: 'Requires one lower case letter, one upper case letter, one digit, 6-13 length, and no spaces. '
				},
				email: {
					regex: /^[\w\-\.\+]+\@[a-zA-Z0-9\.\-]+\.[a-zA-z0-9]{2,4}$/,
					error: 'Must be a valid e-mail address (user@example.com)'
				},
				firstName: {
					regex: /[a-zA-Z ]{3,30}/,
					error: 'Your first name must be between 3-30 characters long'
				},
				lastName: {
					regex: /[a-zA-Z ]{3,30}/,
					error: 'Your first name must be within 3-30 characters long'
				},
				phoneNumber: {
					regex: /^[2-9]\d{2}-\d{3}-\d{4}$/, 
					error: 'Must be a valid US phone number (999-999-9999)'
				},
				age: {
					regex: /^\d{1,2}$/,
					error: 'Invalid age (You must be 16 or older)',
					min: 16
				},
				address: {
					max: 120,
					error: 'Must be lesser than 120 characters long'
				}
			};

			var validate = function(klass, value) {
				var isValid = true;
				var error = '';

				if (!value && /required/.test(klass)) {
					error = 'This field is required';
					isValid = false
				} else {
					for (var f in filters) {
						var regex = new RegExp(f);

						if (regex.test(klass)) {
							if(filters[f].regex) {
								if (value && !filters[f].regex.test(value)) {
									error = filters[f].error;
									isValid = false;
								}
							}

							if(filters[f].max) {
								if (value.length > filters[f].max) {
									error = filters[f].error;
									isValid = false;
								}
							}

							if(filters[f].min) {
								if (parseInt(value, 10) < filters[f].min) {
									error = filters[f].error;
									isValid = false;
								}
							}

							break;
						}
					}
				}

				return {
					isValid: isValid,
					error: error
				};
			};

			var printError = function($input) {
				var klass = $input.attr('class');
				var value = $input.val();

				var test = validate(klass, value);

				var $error = $('<div class="has-error"><label class="control-label">' + test.error + '</label></div>');

				$input.removeClass('invalid').siblings('.has-error').remove();

				if (!test.isValid) {
					$input.addClass('invalid');

					$error.insertAfter($input);
				}
			};

			$inputs.keyup(function() {
				printError($(this));
			});

			$($form.element).submit(function(e) {
				$inputs.each(function() {
					if ($(this).is('.required')) {
						printError($(this));
					}
				});
			
				if (!$('#agreeTerms').prop('checked')) {
					alert('Please check Terms and Conditions');

					return false;
				}

				if ($($form.element).find('input.invalid').length) {
					e.preventDefault();

					alert('The form does not validate! Check again please');
				}
			});

			return $form;
		}
	});

	$.fn[ pluginName ] = function ( options ) {
			return this.each(function() {
					if ( !$.data( this, "plugin_" + pluginName ) ) {
							$.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
					}
			});
	};

})( jQuery, window, document );
