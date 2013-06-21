function hashChange(){
	$(".view-container-content").hide();
	$(window.location.hash).show();
	$(".tab-bar > li").removeClass("active");
	$('.tab-bar a[href="' + window.location.hash + '"]').parent("li").addClass("active");
}
$(function(){if(window.location.hash)hashChange();});
/*$(window).hashchange(hashChange);*/
$("input[type='text'],input[type='password']").click(function(){$(this).select()})

app.controller('settings_controller', function($scope){
	$scope.orgName = "";
	$scope.orgEmail = "";
	$scope.txtName = "";
	$scope.txtEmail = "";
	$scope.txtPassword = "";
	$scope.orgPicture = "/static_files/profile_pictures/null.png";

	$scope.pw_1 = "";
	$scope.pw_2 = "";

	$scope.valid = false;

	$scope.request = {};
	$scope.request.profile = {
		display_name: "",
		password: "",
		email: ""
	};
	$scope.request.sync = {};
	$scope.request.synergytube ={};

	if(typeof io != "undefined")
		$scope.socket = io.connect('//' + window.location.host + ':8080', { query:"session_id=" + readCookie("session_id") + "&channel_id=1", secure: location.protocol === "https:" });

	$scope.socket.on('channel.init', function(data){
		$scope.txtName = $scope.orgName = data.user_data.display_name;
		$scope.txtEmail = $scope.orgEmail = data.user_data.email;
		$scope.orgPicture = data.user_data.picture;
		$scope.$apply();
	});

	$scope.imageUpload = function(input){
		if(input.files && input.files[0]){
			$(".text-error").text("");
			var file = input.files[0];

			if(file.type === "image/gif" || file.type === "image/png" || file.type === "image/jpeg"){	
				if(file.size > 2097152){
					$(".text-error").text("File is bigger than the given Limit.");
				} else {
					if(!window.FileReader)
						$(".text-error").text("Upgrade your Browser to enable Avatar-Upload.");
					var reader = new FileReader();
					reader.onload = function(e){
						$('#imgShow').attr('src', e.target.result);
						$scope.request.profile.avatar = e.target.result;
					};
					reader.readAsDataURL(file);
				}
			} else {
				$(".text-error").text("Please select a valid Image (either GIF, PNG or JPG).");
			}
		}
	};
	$scope.show_confirm = function(){
		if($scope.txtPassword.length === 0 && $scope.txtEmail === $scope.orgEmail)
			$(".confirmation").animate({ opacity: 'hide' });
		else
			$(".confirmation").animate({ opacity: 'show' });
	};
	$scope.valid_submit = function(){
		$(".text-error").text("");

		if($scope.txtName !== $scope.orgName)
			if($scope.txtName.length >= 3)
				$scope.request.profile.display_name = $scope.txtName;
			else
				$scope.showError("#txtName", "The Displayname has to be longer than 2 characters.");

		if($scope.txtEmail !== $scope.orgEmail)
			if($scope.txtEmail.length >= 5)
				$scope.request.profile.email = $scope.txtEmail;
			else
				$scope.showError("#txtEmail", "Please enter a valid Email address.");

		if($scope.txtPassword.length >= 7)
			$scope.request.profile.password = $scope.txtPassword;
		else if($scope.txtPassword.length > 0)
			$scope.showError("#txtPassword", "The Password has to be at least 7 characters long.");

		alert($scope.request.profile.password.length + $scope.request.profile.email.length);

		if($scope.request.profile.password.length + $scope.request.profile.email.length > 0)
			if($scope.pw_1 === $scope.pw_2)
				$scope.request.profile.orgPassword = $scope.pw_1;
			else
				$scope.showError("#pw_1", "The given passwords do not match, please retype them.");
		else
			$scope.showError("#pw_1", "Please enter your current password to confirm your actions.");

		if($scope.valid)
			$scope.submit();

	};
	$scope.submit = function(){
		$(".text-error").text("");
		$(".view-container-spinner").animate({ opacity:'show' });
		$scope.socket.emit('settings.set', $scope.request, function(data){
			alert(JSON.stringify(data));
			$(".view-container-spinner").animate({ opacity:'hide' });
		});
	};
	$scope.showError = function(focus, error){
		$scope.valid = false;
		$(".text-error").append("<br>" + error);
		$(focus).focus();
	};
});