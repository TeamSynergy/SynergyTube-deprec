/*if(typeof io !== "undefined")
	socket = io.connect('//' + window.location.host + ':8080', { query:"session_id=" + readCookie("session_id"), secure: location.protocol === "https:" });
else
	alert("Seems like our Servers are currently down :(");*/

function settings_controller($scope){

}

var app = angular.module('syn_app', []);

app.controller('navbar_controller', function($scope){
	$scope.collapsed = $(window).width() < 767;
	$scope.showLoginForm = false;
	$scope.doLogin = true;

	$scope.collapsableResize = function(){
		if($scope.collapsed && $(window).width() >= 767)
			$scope.uncollapse();
		else if(!$scope.collapsed && $(window).width() < 767)
			$scope.collapse();
	};
	$scope.menuToggle = function(){
		if($scope.collapsed)
			$scope.uncollapse();
		else
			$scope.collapse();
	};
	$scope.collapse = function(){
		$('.nav').css('display', 'none');
		$('.nav').css('opacity', 0);
		$('.nav li').css('height', 0);
		$scope.collapsed = true;
	};
	$scope.uncollapse = function(){
		$('.nav').css('display', 'inline');
		$('.nav').css('opacity', 1);
		$('.nav li').css('height', 'auto');
		$scope.collapsed = false;
	};
	$scope.processLink = function(obj){
		if(!$scope.collapsed && !$(obj).children('a').hasClass('no-collapse') && $(window).width() < 767)
			$scope.collapse();
	};
	$scope.userForm = function(login){
		$scope.showLoginForm = !$scope.showLoginForm;
		$scope.doLogin = login;
		if($(window).width() < 767)
			$(".user-form, .login-form-button > .chevron").animate({ height: 'toggle' });
		else
			$(".user-form, .login-form-button > .chevron").animate({ width: 'toggle' });
	};
});

$(function(){
	equalHeight($('.row > .column > .info-box'));
});



/* === useful direcitves === */

app.directive('onResize', function(){
	return function(scope, element, attrs){
		$(window).resize(function(){
			scope.$apply(attrs.onResize);
		});
	};
});
app.directive('onChange', function(){
	return function(scope, element, attrs){
		$(element[0]).live('input', function(){
			scope.$apply(attrs.onChange);
		});
	};
});
app.directive('onScroll', function(){
	return function(scope, element, attrs){
		var raw = element[0];
		element.bind('scroll', function(){
			if(raw.scrollTop <= 0)
				scope.$apply(attrs.onScroll);
		});
	}
});
app.directive('parseUrl', function() {
	var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
	return function (scope, element, attrs) {
		scope.$watch(element, function(){
			var value = element.html();
			angular.forEach(value.match(urlPattern), function(url){
				value = value.replace(url,	"<a target=\"" + attrs.parseUrl + "\" href="+ url + ">" + url +"</a>");
			});
			element.html(value);
		});
	}
});
app.directive('clickChildren', function($parse){
	return {
		restrict: 'A',
		link: function(scope, element, attrs){
			var selector = attrs.selector;
			var href = $(this).children('a').attr('href');
			var fun = $parse(attrs.clickChildren);
			element.on('click', selector, function(e){
				if(href === "" || href === "#");
					e.preventDefault();
				fun(scope)(this);
			});
		}
	};
});
app.directive('slideCollb', function(){
	return function(scope, element, attrs){
		element.click(function(){
			if($(window).width() < 767)
				$(attrs.slideCollb).animate({ height: 'toggle' });
			else
				$(attrs.slideCollb).animate({ width: 'toggle' });
		});
	};
});


/* === some everyday functions === */

function equalHeight(group) {
	var tallest = 0;
	group.each(function() {
		var thisHeight = $(this).height();
		if(thisHeight > tallest)
			tallest = thisHeight;
	});
	group.height(tallest);
}
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
function eraseCookie(name) {
	createCookie(name,"",-1);
}