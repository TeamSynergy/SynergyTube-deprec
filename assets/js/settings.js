app.controller('settings_controller', function($scope){
	$scope.txtName = "";
	$scope.txtEmail = "";
	$scope.txtNewPwd = "";
	$scope.pictureBlob = "";
	$scope.pw_1 = "";
	$scope.pw_2 = "";

	if(typeof io != "undefined")
		$scope.socket = io.connect('//' + window.location.host + ':8080', { query:"session_id=" + readCookie("session_id") + "&channel_id=1", secure: location.protocol === "https:" });

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
						$scope.pictureBlob = e.target.result;
					};
					reader.readAsDataURL(file);
				}
			} else {
				$(".text-error").text("Please select a valid Image (either GIF, PNG or JPG).");
			}
		}
	};
	$scope.clkTabBar = function(item){
		
	};
	$scope.show_confirm = function(){
		if($scope.txtName.length + $scope.txtEmail.length + $scope.txtNewPwd.length === 0)
			$(".confirmation").animate({ opacity: 'hide' });
		else
			$(".confirmation").animate({ opacity: 'show' });
	};
	$scope.valid_submit = function(){
		if($scope.txtName.length > 3 || $scope.txtEmail.length > 4 || $scope.txtNewPwd.length > 6)
			if($scope.pw_1 == $scope.pw_2){
				if($scope.pw_1.length + $scope.pw_2.length != 0){
					$scope.submit();
				} else {
					$(".text-error").text("Please enter your Passwords.");
					$("#pw_1").focus();
				}
			} else {
				$(".text-error").text("The given passwords do not match, please retype them.");
				$("#pw_1").focus();
			}
		else if($scope.txtName.length + $scope.txtEmail.length + $scope.txtNewPwd.length > 0)
			$(".text-error").text("Displaynames must be longer than 3 Characters and Passwords must be longer than 4 Characters.");
		else
			$scope.submit();

	};
	$scope.submit = function(){
		if($scope.pictureBlob.length > 0)
			$scope.socket.emit('user.profile.picture', { file: $scope.pictureBlob }, function(data){
				alert(JSON.stringify(data));
			});
	};
});