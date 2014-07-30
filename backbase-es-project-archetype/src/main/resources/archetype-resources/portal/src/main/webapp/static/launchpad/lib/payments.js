define("launchpad/lib/payments/payment-orders-model",["jquery","angular","launchpad/lib/common/util","launchpad/lib/payments/payments-module"],function(h,k,g,b){b.factory("PaymentOrdersModel",["$rootScope","customerId","pendingPaymentOrdersTimeout","httpService",function(b,a,d,f){b=function(c){c.paymentOrdersEndpoint&&(this.paymentOrdersEndpoint=c.paymentOrdersEndpoint);c.pendingPaymentOrdersEndpoint&&(this.pendingPaymentOrdersService=f.getInstance({endpoint:c.pendingPaymentOrdersEndpoint,urlVars:{partyId:a},
cacheTimeout:d}));c.paymentOrdersSubmitPoint&&(this.paymentOrdersSubmitPoint=c.paymentOrdersSubmitPoint);this.locale=c.locale;this.submitError=this.loadError=this.createError=this.pendingOrdersGroups=null};b.prototype.create=function(a,b){var s=this,d=f.getInstance({endpoint:this.paymentOrdersEndpoint,urlVars:{orderId:b}}).create({data:a});d.error(function(a){a.errors&&(s.createError=a.errors[0].code)});return d};b.prototype.load=function(a){var b=this;a=this.pendingPaymentOrdersService.read({},a);
a.success(function(a){b.pendingOrdersGroups=a&&"null"!==a?a:[]});a.error(function(a){b.submitError=a.errorCode||500});return a};b.prototype.submit=function(a,b){var s=this,d=f.getInstance({endpoint:this.paymentOrdersSubmitPoint,urlVars:{orderId:a}}),e={};b&&(e.auth_password=b);d=d.update({data:e});d.error(function(a){s.submitError=a.errorCode||500});return d};return b}])});define("launchpad/lib/payments/currency-amount-input",["angular","launchpad/lib/payments/payments-module","launchpad/support/angular/angular-ui-bootstrap","launchpad/lib/common/util"],function(h,k){k.controller("lpCurrencyAmountController",["$scope",function(g){g.wholeAmount="";g.decimalAmount="";g.amountInDomesticCurrency="0.00";g.fieldLength=6}]);k.directive("lpCurrencyAmountInput",["$templateCache",function(g){g.put("$currencyAmountTemplate.html",'\x3cdiv class\x3d"lp-currency-amount-input"\x3e\x3cdiv class\x3d"clearfix"\x3e\x3cdiv class\x3d"select-area pull-left"\x3e\x3cdiv class\x3d"currency-select" ng-hide\x3d"lpDisableCurrencySelection" dropdown-select\x3d"dropdown-select" empty-placeholder-text\x3d"EUR" ng-model\x3d"lpCurrencyList.selected" ng-options\x3d"val as val.currency_code group by val.group for val in lpCurrencyList.orderedCurrencies" ng-hide\x3d"lpCurrencyList.error" aria-required\x3d"true" aria-label\x3d"currency"\x3e\x3c/div\x3e\x3cdiv class\x3d"default-currency" ng-show\x3d"lpDisableCurrencySelection"\x3e{{lpCurrencyList.defaultCurrency.currency_code}}\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"amount-area pull-left""\x3e\x3cinput name\x3d"wholeAmountInput" type\x3d"number" lp-number-input\x3d"lp-number-input" lp-max-length\x3d"fieldLength" min\x3d"0" step\x3d"1" class\x3d"form-control whole-amount-input pull-left" ng-model\x3d"wholeAmount" placeholder\x3d"Amount" aria-required\x3d"true" aria-label\x3d"amount" /\x3e\x3cdiv  class\x3d"pull-left decimal"\x3e\x3cspan class\x3d"decimal-point"\x3e.\x3c/span\x3e\x3c/div\x3e\x3cinput type\x3d"number" lp-number-input\x3d"lp-number-input" lp-max-length\x3d"2" min\x3d"0" step\x3d"1" class\x3d"form-control pull-left decimal-amount-input" ng-model\x3d"decimalAmount" placeholder\x3d"00"  aria-required\x3d"true" aria-label\x3d"decimal amount" /\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"info"\x3e\x3cdiv ng-hide\x3d"lpDisableCurrencySelection || lpCurrencyList.error || lpCurrencyList.selected \x3d\x3d\x3d lpCurrencyList.defaultCurrency" class\x3d"info-message"\x3e\x3cspan class\x3d"text-muted"\x3eThis transfer is {{amountInDomesticCurrency}} in {{lpCurrencyList.defaultCurrency.currency_code}}\x3ci class\x3d"lp-icon lp-icon-xxl lp-icon-info-sign open-popup" ng-click\x3d"toggleExchangeRateModal()"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e');
return{restrict:"EA",scope:{amount:"\x3dngModel",lpCurrencyList:"\x3d",lpPaymentOrder:"\x3d",lpDisableCurrencySelection:"\x3d",toggleExchangeRateModal:"\x3dmodal"},require:"ngModel",replace:!0,controller:"lpCurrencyAmountController",template:g.get("$currencyAmountTemplate.html"),link:function(b,e,a,d){var f=e.find(".decimal-amount-input"),c=function(){var a=b.amount,a=a/b.lpCurrencyList.selected.exchange_rate,a=a.toFixed(2);b.amountInDomesticCurrency=a},m=function(){var a=parseInt(b.wholeAmount,10),
a=isNaN(a)?0:a,e=parseFloat("0."+b.decimalAmount),e=(0===e?a:a+e).toFixed(2);b.fieldLength&&a.toString().length>b.fieldLength?d.$setValidity("lpCurrencyMaxLength",!1):d.$setValidity("lpCurrencyMaxLength",!0);"0.00"===e?d.$setValidity("lpAmountRequired",!1):0<e.length&&d.$setValidity("lpAmountRequired",!0);b.amount=e;0<b.lpCurrencyList.orderedCurrencies.length&&c()};b.$watchCollection("[wholeAmount, decimalAmount]",function(a){a[0]&&-1<a[0].toString().indexOf(".")&&(b.wholeAmount=parseInt(b.wholeAmount.toString().replace(".",
""),10),f.focus());m()});b.$watch("lpCurrencyList.selected",function(){if(b.lpCurrencyList.selected){b.lpPaymentOrder.instructedCurrency=b.lpCurrencyList.selected.currency_code;var a=b.fieldLength;b.fieldLength=2<b.lpCurrencyList.selected.exchange_rate?8:6;a>b.fieldLength&&6<b.wholeAmount.toString().length?(b.wholeAmount=parseInt(b.wholeAmount.toString().substring(0,6),10),m()):""===b.wholeAmount&&""===b.decimalAmount||c()}});b.$on("reset",function(){b.wholeAmount="";b.decimalAmount="";b.amountInDomesticCurrency=
"0.00";b.fieldLength=6})}}}])});define("launchpad/lib/payments/currency-input",["jquery","angular","launchpad/lib/payments/payments-module"],function(h,k,g){g.value("currencyMaxLength",15).directive("lpInputCurrency",["currencyMaxLength",function(b){return{restrict:"A",require:"ngModel",link:function(e,a,d,f){var c=/^\d+((\.|\,)\d+)?$/,m=function(a,c,b){f.$setValidity("lpCurrencyFormat",a);a||(b=c=!0);f.$setValidity("lpCurrencyNonZero",c);f.$setValidity("lpCurrencyMaxLength",b)};f.$parsers.unshift(function(a){a?(a=a.replace(",",
"."),m(c.test(a),0!==parseFloat(a),a.length<b)):m(!0,!0,!0);return a})}}}])});define("launchpad/lib/payments/iban-input","jquery angular launchpad/lib/common/util launchpad/lib/payments/payments-module launchpad/lib/payments/iban-model launchpad/support/angular/angular-ui-bootstrap".split(" "),function(h,k,g,b){b.directive("lpIbanInput",["$templateCache","$timeout","IbanModel","widget",function(b,a,d,f){b.put("$ibanCountryOptionTemplate.html",'\x3cspan aria-label\x3d"{{option.country_name}}"\x3e{{option.country_code}}\x3cspan class\x3d"country-name"\x3e - {{option.country_name}}\x3c/span\x3e\x3c/span\x3e');
return{restrict:"EA",replace:!0,require:["ngModel","^form"],scope:{ibanModel:"\x3dlpCountryList"},template:'\x3cdiv class\x3d"lp-iban"\x3e\x3cdiv class\x3d"lp-iban-country-dropdown"\x3e\x3cdiv dropdown-select\x3d"dropdown-select" empty-placeholder-text\x3d"NL" name\x3d"ibaneDropdownField" ng-model\x3d"iban.selectedCountry" ng-options\x3d"country.country_code as country for country in ibanModel.countryList" filter\x3d"ibanModel.enableCountrySearch" filter-placeholder-text\x3d"Search country" ng-change\x3d"change()" option-template-url\x3d"$ibanCountryOptionTemplate.html" aria-label\x3d"iban country code"\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"lp-iban-input" ng-class\x3d"{\'has-success\': ibanModel.valid \x26\x26 iban.value.length, \'has-error\': !ibanModel.valid \x26\x26 iban.value.length,  \'has-feedback\': iban.value.length}"\x3e\x3cinput name\x3d"ibanInputField" required\x3d"required" type\x3d"input" class\x3d"form-control" lp-input-overflow\x3d"lp-input-overflow" ng-model\x3d"iban.value"  aria-required\x3d"true" ng-keydown\x3d"getSelection($event)" ng-keypress\x3d"getSelection($event)" ng-mousedown\x3d"getSelection($event)" ng-mouseup\x3d"getSelection($event)" ng-change\x3d"change()" tabindex\x3d"0" placeholder\x3d"Enter IBAN or Account Number" aria-label\x3d"Enter IBAN or Account Number"\x3e\x3cspan ng-if\x3d"ibanModel.valid \x26\x26 iban.value.length" class\x3d"glyphicon glyphicon-ok form-control-feedback"\x3e\x3c/span\x3e\x3cspan ng-if\x3d"!ibanModel.valid \x26\x26 iban.value.length" ng-click\x3d"clear()" class\x3d"glyphicon glyphicon-remove form-control-feedback"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e',
link:function(c,b,d,e){var f=e[0];e=e[1];var n=b.find("input")[0],k=[],q=!1,p=0;c.iban={};f.$name=d.name;e.$addControl(f);c.$watch("ibanModel.countryList",function(a){c.change(!0);c.ibanModel.countryList.length&&!c.iban.selectedCountry&&(c.iban.selectedCountry=c.ibanModel.countryList[0].country_code)});f.$formatters.push(function(a){c.ibanModel.value=a;c.iban.value=v(a);var b=c.ibanModel.getCountryCode();c.ibanModel.validate();b&&c.change(!0);f.$setValidity("validIban",b?c.ibanModel.valid:!1);return a});
f.$parsers.push(function(a){var b=c.ibanModel.getCountryCode()?c.ibanModel.validate():!1;f.$setValidity("validIban",b);return b?a:void 0});var r=h(document.createElement("span"));r.addClass("lp-input-cursor-position-offset");r.css("font-size",b.css("font-size"));h(n).after(r);var v=function(a){var b=[];b.push(a.substr(0,2));for(a=a.substr(2);0<a.length;)b.push(a.substr(0,4)),a=a.substr(4);return b.join("-")};c.setCursorPosition=function(){var b=g.getNewCaretPosition(n,k,p,q);q=!1;if(2<b&&(b++,6<b)){var d=
(b-3)/4;parseInt(d,10)===d&&b--;b+=parseInt(d,10)}a(function(){g.setCaretPositionOfInput(n,b,c.paymentReference,r)},0,!1)};c.getSelection=function(a){k=g.getSelectionPositionOfInput(n,function(a){var b=0,c=a;2<c&&(c-=3,b++);b+=parseInt(c/5,10);return a-b});"[object KeyboardEvent]"===a.originalEvent.toString()&&8===a.originalEvent.which&&n.value.length&&(q=!0)};c.clear=function(){c.iban.value="";n.focus()};c.change=function(d){if(c.ibanModel.value!==c.ibanModel.normalizeIban(c.iban.selectedCountry+
c.iban.value)){var e=c.ibanModel.normalizeIban(c.iban.value);c.ibanModel.getCountryCode(e)||(e=c.iban.selectedCountry+e);p=e.length-c.ibanModel.value.length;c.ibanModel.value=e;f.$setViewValue(e)}if(e=c.ibanModel.getCountryCode())e!==c.iban.selectedCountry&&(c.iban.selectedCountry=e,h(b.find("button")[0]).addClass("lp-country-dropdown-update"),a(function(){h(b.find("button")[0]).removeClass("lp-country-dropdown-update")},200,!1)),c.iban.value=c.ibanModel.value.substr(2);c.iban.value=v(c.ibanModel.normalizeIban(c.iban.value));
d||c.setCursorPosition()}}}}])});define("launchpad/lib/payments/payment-mode-tabs",["angular","launchpad/lib/payments/payments-module","launchpad/lib/common/util","launchpad/support/angular/angular-ui-bootstrap"],function(h,k,g){k.directive("paymentModeTabs",["$templateCache",function(b){b.put("paymentModeTabs.html",'\x3cdiv class\x3d"lp-payment-mode-tabs"\x3e\x3cdiv\x3e\x3cul tabset\x3d"tabset" class\x3d"payment-mode-tab-area"\x3e\x3cli tab\x3d"tab"\x3e\x3cspan tab-heading\x3d"tab-heading" class\x3d"tab-heading" ng-click\x3d"setScheduledTransfer(false)"\x3eOne Time\x3c/span\x3e\x3cdiv class\x3d"one-time clearfix"\x3e\x3cdiv class\x3d"pull-left text"\x3eSending date\x3c/div\x3e\x3cdiv class\x3d"pull-left date-picker"\x3e\x3cinput ng-click\x3d"openCalendar($event)" required\x3d"required" type\x3d"text" name\x3d"scheduleDate" ng-model\x3d"paymentOrder.scheduleDate" datepicker-popup\x3d"dd/MM/yyyy" is-open\x3d"paymentOrder.isOpenDate" class\x3d"form-control" lp-future-time\x3d""datepicker-options\x3d"dateOptions" show-button-bar\x3d"false" tabindex\x3d"0" placeholder\x3d"select date" aria-label\x3d"select date" /\x3e\x3cspan ng-click\x3d"openCalendar($event)" class\x3d"lp-icon lp-icon-calendar calendar-icon"\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"urgent-transfer clearfix"\x3e\x3cdiv class\x3d"urgent-checkbox pull-left"\x3e\x3cinput aria-label\x3d"urgent transfer" ng-model\x3d"paymentOrder.urgentTransfer" type\x3d"checkbox" /\x3e\x3c/div\x3e\x3cdiv class\x3d"urgent-message pull-left"\x3e\x3cspan class\x3d"text-muted"\x3eMake transfer urgent\x3ci class\x3d"lp-icon lp-icon-xxl lp-icon-info-sign open-popup" ng-click\x3d"toggleUrgentTransferModal()"\x3e\x3c/i\x3e\x3c/span\x3e\x3c/div\x3e\x3c/div\x3e\x3cp ng-show\x3d"paymentOrder.urgentTransfer" class\x3d"urgent-transfer-message"\x3e\x3cspan lp-message\x3d"\'urgentTransferMessage\'" lp-bundle\x3d"messages"\x3e\x3c/span\x3e\x3c/p\x3e\x3c/li\x3e\x3cli tab\x3d"tab"\x3e\x3cspan tab-heading\x3d"tab-heading" class\x3d"tab-heading" ng-click\x3d"setScheduledTransfer(true)"\x3eScheduled\x3c/span\x3e\x3cscheduled-transfer ng-model\x3d"paymentOrder.scheduledTransfer.intervals"\x3e\x3c/scheduled-transfer\x3e\x3c/li\x3e\x3c/div\x3e\x3c/div\x3e');
return{restrict:"AE",replace:!0,template:b.get("paymentModeTabs.html"),link:function(b,a,d,f){b.toggleUrgentTransferModal=function(){b.urgentTransferModalShown=!b.urgentTransferModalShown};b.setScheduledTransfer=function(a){b.paymentOrder.isScheduledTransfer=a};b.urgentTranfer=!1}}}])});define("launchpad/lib/payments/payment-ref-description",["jquery","angular","launchpad/lib/payments/payments-module","launchpad/lib/common/util","launchpad/support/angular/angular-ui-bootstrap"],function(h,k,g,b){g.filter("addSeperator",function(){return function(b){if(b){b=b.split(" ").join("");b=b.toUpperCase();b=b.match(/.{1,4}/g);for(var a="",d=0;d<b.length;d++){if(d!==b.length-1){var f=b,c=d,m=b[d];4===m.length&&(m+=" ");f[c]=m}a+=b[d]}return a}}});g.directive("lpFormatPaymentReference",["$filter",
function(b){return{restrict:"A",require:"ngModel",link:function(a,d,f,c){c.$parsers.push(function(a){a&&2<a.length&&"RF"!==a.substring(0,2)&&(a="RF"+a);var d=b("addSeperator")(a);d!==a&&(c.$setViewValue(d),c.$render());return d})}}}]);g.controller("lpPaymentRefDescController",["$scope",function(b){b.paymentReference="";b.paymentDescription="";b.showInfoMessage=!1;b.paymentRefDisabled=!1;b.paymentDescDisabled=!1}]);g.directive("lpPaymentRefDescription",["$templateCache","$timeout",function(e,a){e.put("$paymentRefDescription.html",
'\x3cdiv class\x3d"lp-payment-ref-description"\x3e\x3cdiv class\x3d"lp-payment-reference" ng-class\x3d"{\'has-success\': isValid \x26\x26 paymentReference.length \x3e 0, \'has-error\': !isValid \x26\x26 paymentReference.length \x3e 0,  \'has-feedback\': paymentReference.length}"\x3e\x3cinput class\x3d"form-control" aria-label\x3d"payment reference" lp-payment-reference-field" type\x3d"text" placeholder\x3d"Payment reference (optional)" maxlength\x3d"31" ng-model\x3d"paymentReference" ng-disabled\x3d"paymentRefDisabled" lp-input-overflow\x3d"lp-input-overflow" ng-keydown\x3d"getSelection($event)" ng-keypress\x3d"getSelection($event)" ng-mousedown\x3d"getSelection($event)" ng-mouseup\x3d"getSelection($event)" lp-format-payment-reference\x3d"lp-format-payment-reference"/\x3e\x3cspan ng-if\x3d"isValid \x26\x26 paymentReference.length" class\x3d"glyphicon glyphicon-ok form-control-feedback"\x3e\x3c/span\x3e\x3cspan ng-click\x3d"clearRef()" ng-if\x3d"!isValid \x26\x26 paymentReference.length" class\x3d"glyphicon glyphicon-remove form-control-feedback"\x3e\x3c/span\x3e\x3cdiv class\x3d"lp-payment-reference-dividers clearfix"\x3e\x3cdiv class\x3d"separator"\x3e\x3c/div\x3e\x3cdiv class\x3d"separator"\x3e\x3c/div\x3e\x3cdiv class\x3d"separator"\x3e\x3c/div\x3e\x3cdiv class\x3d"separator"\x3e\x3c/div\x3e\x3cdiv class\x3d"separator"\x3e\x3c/div\x3e\x3cdiv class\x3d"separator"\x3e\x3c/div\x3e\x3c/div\x3e\x3c/div\x3e\x3cdiv class\x3d"lp-payment-description"\x3e\x3ctextarea aria-label\x3d"payment description" class\x3d"form-control lp-payment-description-area" placeholder\x3d"Description (optional) Maximum number of characters is 140" maxlength\x3d"140" ng-model\x3d"paymentDescription" ng-disabled\x3d"paymentDescDisabled"\x3e\x3c/textarea\x3e\x3c/div\x3e\x3cdiv class\x3d"hover-catcher" ng-class\x3d"{refDisabled: paymentRefDisabled, descDisabled: paymentDescDisabled}" ng-mouseover\x3d"toggleInfoMessage()" ng-mouseleave\x3d"toggleInfoMessage()"\x3e\x3c/div\x3e\x3cp class\x3d"text-muted info-message" ng-if\x3d"showInfoMessage"\x3eYou can only provide a Payment Reference or a Payment Description, not both.\x3c/p\x3e\x3c/div\x3e');
return{restrict:"AE",replace:!0,require:["ngModel","^form"],template:e.get("$paymentRefDescription.html"),link:function(d,f,c,e){var g=e[0],k=e[1];e=f.find("input");f.find(".hover-catcher");f.find("textarea");var l=e[0],n=[],t=!1,q=0;g.$name=c.name;var p=h(document.createElement("span"));p.addClass("lp-input-cursor-position-offset");p.css("font-size",f.css("font-size"));h(l).after(p);d.toggleInfoMessage=function(){d.showInfoMessage=!d.showInfoMessage};d.setCursorPosition=function(){var c=b.getNewCaretPosition(l,
n,q,t);t=!1;if(4<c){var f=c/4;parseInt(f,10)===f&&c--;c+=parseInt(f,10)}a(function(){b.setCaretPositionOfInput(l,c,d.paymentReference,p)},0,!1)};d.getSelection=function(a){n=b.getSelectionPositionOfInput(l,function(a){var b;b=0+parseInt(a/5,10);return a-b});"[object KeyboardEvent]"===a.originalEvent.toString()&&8===a.originalEvent.which&&l.value.length&&(t=!0)};d.clearRef=function(){d.paymentReference="";l.focus()};d.$watch("paymentReference",function(a,c){if(c!==a){c||(c="");if(!a)g.$modelValue.paymentReference=
"",d.paymentDescDisabled=!1,k.$removeControl(g);else if(0<a.length){k[g.$name]||k.$addControl(g);var f=a.split(" ").join(""),e=!0;25<f.length&&(e=!1);f.match(/^RF\d{2}/)||(e=!1);b.validateISO7064Checksum(f)||(e=!1);d.isValid=e;g.$setValidity("validRef",d.isValid);q=c?f.length-c.split(" ").join("").length:f.length;d.paymentDescDisabled=!0;g.$modelValue.paymentReference=f}d.setCursorPosition()}},!0);d.$watch("paymentDescription",function(a,b){b!==a&&(a?0<a.length&&(d.paymentRefDisabled=!0,g.$modelValue.paymentDescription=
a):(d.paymentRefDisabled=!1,g.$modelValue.paymentDescription=""))},!0);d.$on("reset",function(){d.paymentReference="";d.paymentDescription="";d.showInfoMessage=!1;d.paymentRefDisabled=!1;d.paymentDescDisabled=!1})}}}])});define("launchpad/lib/payments/scheduled-transfer","angular jquery launchpad/lib/payments/payments-module launchpad/lib/common/util launchpad/lib/payments/currency-input launchpad/support/angular/angular-ui-bootstrap".split(" "),function(h,k,g,b){var e=b.getContextPath()+"/static/launchpad/lib/ui/templates/";g.directive("nonZero",[function(){return{restrict:"A",require:"ngModel",link:function(a,b,f,c){c.$parsers.unshift(function(a){c.$setValidity("nonZero",0!==parseInt(a,10));return a})}}}]);g.controller("scheduledTransferController",
["$scope",function(a){(function(){a.frequenciesEnum={START_OF_THE_MONTH:"START_OF_THE_MONTH",END_OF_THE_MONTH:"END_OF_THE_MONTH",LAST_FRIDAY_OF_MONTH:"LAST_FRIDAY_OF_MONTH",WEEKLY:"WEEKLY",MONTHLY:"MONTHLY",YEARLY:"YEARLY"};a.frequencies=[{id:a.frequenciesEnum.START_OF_THE_MONTH,value:"First of the month",group:"apreset"},{id:a.frequenciesEnum.END_OF_THE_MONTH,value:"End of the month",group:"apreset"},{id:a.frequenciesEnum.LAST_FRIDAY_OF_THE_MONTH,value:"Last Friday of the month",group:"apreset"},
{id:a.frequenciesEnum.WEEKLY,value:"Weekly",group:"bcustom"},{id:a.frequenciesEnum.MONTHLY,value:"Monthly",group:"bcustom"},{id:a.frequenciesEnum.YEARLY,value:"Yearly",group:"bcustom"}];a.days=[{id:1,value:"M",label:"Monday"},{id:2,value:"T",label:"Tuesday"},{id:3,value:"W",label:"Wednesday"},{id:4,value:"T",label:"Thursday"},{id:5,value:"F",label:"Friday"},{id:6,value:"S",label:"Saturday"},{id:7,value:"S",label:"Sunday"}];a.months=[{id:1,value:"Jan",label:"January"},{id:2,value:"Feb",label:"February"},
{id:3,value:"Mar",label:"March"},{id:4,value:"Apr",label:"April"},{id:5,value:"May",label:"May"},{id:6,value:"Jun",label:"June"},{id:7,value:"Jul",label:"July"},{id:8,value:"Aug",label:"August"},{id:9,value:"Sep",label:"September"},{id:10,value:"Oct",label:"October"},{id:11,value:"Nov",label:"November"},{id:12,value:"Dec",label:"December"}];a.dates=[];for(var b=1;32>b;b++)a.dates.push({id:b,value:b,label:b});a.endOptions=[{id:"after",value:"After"},{id:"onDate",value:"On date"}];a.endOn=a.endOptions[0].id;
a.customOrder=!1;a.dateWarning=!1;a.calendar={startCalendarOpen:!1,endCalendarOpen:!1};a.timesEndDate=a.paymentOrder.scheduledTransfer.endDate;a.setEndDate=function(){var b=a.paymentOrder.scheduledTransfer.timesToRepeat*a.paymentOrder.scheduledTransfer.every;if(0<b){a.paymentOrder.scheduledTransfer.endDate=a.paymentOrder.scheduledTransfer.startDate.clone();switch(a.paymentOrder.scheduledTransfer.frequency){case a.frequenciesEnum.WEEKLY:a.paymentOrder.scheduledTransfer.endDate.addWeeks(b);break;case a.frequenciesEnum.MONTHLY:a.paymentOrder.scheduledTransfer.endDate.addMonths(b);
break;case a.frequenciesEnum.YEARLY:a.paymentOrder.scheduledTransfer.endDate.addYears(b).moveToLastDayOfMonth();break;case a.frequenciesEnum.START_OF_THE_MONTH:a.paymentOrder.scheduledTransfer.endDate.addMonths(b).moveToFirstDayOfMonth();break;case a.frequenciesEnum.LAST_FRIDAY_OF_MONTH:a.paymentOrder.scheduledTransfer.endDate.addMonths(b).moveToLastDayOfMonth();5!==a.paymentOrder.scheduledTransfer.endDate.getDay()&&a.paymentOrder.scheduledTransfer.endDate.moveToDayOfWeek(5,-1);break;default:a.paymentOrder.scheduledTransfer.endDate.addMonths(b).moveToLastDayOfMonth()}a.timesEndDate=
a.paymentOrder.scheduledTransfer.endDate.clone();a.timesEndDate=a.timesEndDate.toString("dd/MM/yyyy")}else a.timesEndDate=""}})()}]);g.directive("scheduledTransfer",[function(){return{restrict:"AE",replace:!0,require:["ngModel","^form"],controller:"scheduledTransferController",templateUrl:e+"scheduled-transfer.html",link:function(a,b,e,c){var g=c[0];b=c[1];g.$name="intervals";b.$addControl(g);var h=[];a.paymentOrder.scheduledTransfer.frequency=a.frequencies[0].id;a.setEndDate();var u=function(b){-1===
h.indexOf(b)&&29<=b?(h.push(b),a.dateWarning=!0):-1<h.indexOf(b)&&(b=h.indexOf(b),h.splice(b,1),0===h.length&&(a.dateWarning=!1))},l=function(){var b=!0,b=0<a.paymentOrder.scheduledTransfer.intervals.length?!0:!1,b=a.customOrder?b:!0,b=a.paymentOrder.isScheduledTransfer?b:!0;g.$setValidity("intervalsRequired",b)};a.frequencyChanged=function(){a.paymentOrder.scheduledTransfer.intervals=[];a.setEndDate();a.paymentOrder.scheduledTransfer.frequency===a.frequenciesEnum.WEEKLY||a.paymentOrder.scheduledTransfer.frequency===
a.frequenciesEnum.MONTHLY||a.paymentOrder.scheduledTransfer.frequency===a.frequenciesEnum.YEARLY?(a.customOrder=!0,l(),a.paymentOrder.scheduledTransfer.customOrder=!0):(a.customOrder=!1,g.$setValidity("intervalsRequired",!0),l(),a.paymentOrder.scheduledTransfer.customOrder=!1)};a.toggleInterval=function(b,c){var d=k(b.target),e;a.paymentOrder.scheduledTransfer.frequency===a.frequenciesEnum.WEEKLY?e=a.days:a.paymentOrder.scheduledTransfer.frequency===a.frequenciesEnum.MONTHLY?e=a.dates:a.paymentOrder.scheduledTransfer.frequency===
a.frequenciesEnum.YEARLY&&(e=a.months);if(d.hasClass("active")){if(d.removeClass("active"),d=e[c].id)u(d),d=a.paymentOrder.scheduledTransfer.intervals.indexOf(d),a.paymentOrder.scheduledTransfer.intervals.splice(d,1)}else if(d.addClass("active"),d=e[c].id)u(d),a.paymentOrder.scheduledTransfer.intervals.push(d);l();a.setEndDate()};a.openStartCalendar=function(b){b.preventDefault();b.stopPropagation();a.calendar.endCalendarOpen=!1;a.calendar.startCalendarOpen=!a.calendar.startCalendarOpen};a.openEndCalendar=
function(b){b.preventDefault();b.stopPropagation();a.calendar.startCalendarOpen=!1;a.calendar.endCalendarOpen=!a.calendar.endCalendarOpen};a.$watch("paymentOrder.scheduledTransfer.timesToRepeat",function(b){b&&a.setEndDate()});a.$watch("paymentOrder.scheduledTransfer.every",function(b){b&&a.setEndDate()});a.$watch("paymentOrder.isScheduledTransfer",function(a){l()});a.endDateOptions={datepickerMode:"year","show-weeks":!1};a.startDateOptions={"show-weeks":!1};a.$on("reset",function(){a.paymentOrder.scheduledTransfer.frequency=
a.frequencies[0].id;a.customOrder=!1;a.paymentOrder.scheduledTransfer.customOrder=!1})}}}])});define("launchpad/lib/payments/payments-module",["angular","launchpad/lib/common","launchpad/lib/ui/ui-module","launchpad/lib/ui/input-overflow"],function(h){h=h.module("payments",["common","ui"]);h.value("pendingPaymentOrdersTimeout",1E4);h.value("customerId","3");return h});define("launchpad/lib/payments/payments-module launchpad/lib/payments/currency-amount-input launchpad/lib/payments/currency-input launchpad/lib/payments/payment-mode-tabs launchpad/lib/payments/payment-orders-model launchpad/lib/payments/payment-ref-description launchpad/lib/payments/scheduled-transfer launchpad/lib/payments/iban-input".split(" "),function(h){return h});
//# sourceMappingURL=payments.js.map