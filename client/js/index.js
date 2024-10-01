//server base domain url 
const domainUrl = "http://localhost:3000";  // if local test, pls use this 

//==================================index.html==================================//

var debug = true;
var authenticated = false;


$(document).ready(function () {

	/**
	----------------------Event handler to process login request----------------------
	**/

	$('#loginButton').click(function () {

		localStorage.removeItem("inputData");
		$("#loginForm").submit();

		if (localStorage.inputData != null) {

			var inputData = JSON.parse(localStorage.getItem("inputData"));

			$.post(domainUrl + "/verifyUser", inputData, function (data, status) {

				if (data.length > 0) {

					alert("Login success");
					authenticated = true;
					localStorage.setItem("userInfo", JSON.stringify(data[0]));
					if (data.userType = "PROFESSIONAL_USER") {
						$.mobile.changePage("#profHomePage");
					} else {
						$.mobile.changePage("#homePage");
					}
				}
				else {
					alert("Login failed");
				}

				$("#loginForm").trigger('reset');
			});
		}

	})

	/**
	----------------------Validation for login request----------------------
	**/

	$("#loginForm").validate({ // JQuery validation plugin
		focusInvalid: false,
		onkeyup: false,
		submitHandler: function (form) {
			authenticated = false;

			var formData = $(form).serializeArray();
			var inputData = {};
			formData.forEach(function (data) {
				inputData[data.name] = data.value;
			})

			localStorage.setItem("inputData", JSON.stringify(inputData));

		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "please enter your email",
				email: "The email format is incorrect  "
			},
			password: {
				required: "It cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			}
		},
	});

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Event handler to respond to signUp Button----------------------
	**/

	$('#signUpButton').click(function () {

		localStorage.removeItem("signUpData");

		// Serialize form data automatically as an array of name-value pairs
		var formArray = $("#signUpForm").serializeArray();

		// Convert the array into an object for easy handling
		var formData = {};
		var haveValues = true;

		$.each(formArray, function (i, field) {
			formData[field.name] = field.value;
			if (field.value.trim() == "") { // If any value is not empty
				haveValues = false;
			}
		});

		// Store form data into localStorage for later use
		localStorage.setItem("signUpData", JSON.stringify(formData));
		console.log(localStorage.signUpData);

		var inputData = {};
		inputData["email"] = formData["email"];

		$.post(domainUrl + "/verifyUser", inputData, function (data, status) {

			if (haveValues && data.length === 0) {

				var signUpData = JSON.parse(localStorage.getItem("signUpData"));

				$.post(domainUrl + "/addUser", signUpData, function (data, status) {
					if (status) {
						alert("Signup success");
						$.mobile.changePage("#loginPage");
					}
					else {
						alert("Signup failed");
					}

					$("#signUpForm").trigger('reset');
				});

				$.mobile.changePage("#loginPage");
			}//end if statement
			else if (data.length > 0)
				alert("User Email already exists");
			//$("#signUpForm").trigger('reset');	
			else
				alert("Signup failed");

		});
	});

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Signup form JQuery validation plugin----------------------
	**/

	$("#signUpForm").validate({
		focusInvalid: false,
		onkeyup: false,
		submitHandler: function (form) {

			var formData = $(form).serializeArray();
			var signUpData = {};
			formData.forEach(function (data) {
				signUpData[data.name] = data.value;
			})

			localStorage.setItem("signUpData", JSON.stringify(signUpData));
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			},
			fullName: {
				required: true,
				rangelength: [1, 100],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			},
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			},
			fullName: {
				required: "Please enter your firstname",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			phoneNumber: {
				required: "Phone number required",
			},
		},
	});

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Event handler to process solution submission----------------------
	**/

	$('#confirmSolutionButton').on('click', function () {

		localStorage.removeItem("inputData");

		$("#solutionForm").submit();



		var solutionInfo = JSON.parse(localStorage.getItem("inputData"));



		localStorage.setItem("solutionInfo", JSON.stringify(solutionInfo));


		$.post(domainUrl + "/addSolution", solutionInfo, function (data, status) {

			//clear form data 
			$("#solutionForm").trigger('reset');
			alert("Solution Save Succesful");
			$.mobile.changePage("#homePage");

		});

	});

	/**
	----------------------Solution form validation----------------------
	**/

	$("#solutionForm").validate({  // JQuery validation plugin
		focusInvalid: false,
		onkeyup: false,
		submitHandler: function (form) {

			var formData = $(form).serializeArray();
			var inputData = {};

			formData.forEach(function (data) {
				inputData[data.name] = data.value;
			});

			var userInfo = JSON.parse(localStorage.getItem("userInfo"));
			inputData["proffesionalUserId"] = userInfo._id;
			inputData["photo"] = localStorage.getItem("imageByteCode");

			localStorage.setItem("inputData", JSON.stringify(inputData));

		},

		/* validation rules */

		rules: {
			solutionHeading: {
				required: true,
				rangelength: [1, 30]
			},
			instructions: {
				required: true,
				rangelength: [1, 100]
			},
			description: {
				required: true,
				rangelength: [1, 100]
			},
		},
		/* Validation Message */

		messages: {
			solutionHeading: {
				required: "Please enter the Solution Heading",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			instructions: {
				required: "Please insert the instructions for the solution.",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
			description: {
				required: "Please insert a description for the solution.",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),
			},
		}
	});

	/**
	--------------------------end--------------------------
	**/


	/**
	--------------------Event handler to perform initialisation before the Login page is displayed--------------------
	**/

	$(document).on("pagebeforeshow", "#loginPage", function () {

		localStorage.removeItem("userInfo");

		authenticated = false;

	});

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Function to make rating stars based on the number value--------------------
	**/

	function generateStars(rating) {
		let stars = '';
		for (let i = 0; i < 5; i++) {
			if (i < rating) {
				stars += '⭐';
			} else {
				stars += '☆';
			}
		}
		return stars;
	}

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Event handler to inject the tiles into the HTML--------------------
	**/

	$(document).on("pagebeforeshow", "#homePage", function displayOrders() {

		var userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if (!userInfo) {
			$.mobile.changePage("#loginPage");
		} else if (userInfo.userType === "PROFESSIONAL_USER") {
			$.mobile.changePage("#profHomePage");
		}

		$('#searchInput').val('');
		const container = $('#tilesContainer'); // The container where tiles will be injected
		$('#ratingSolutionButton').hide();

		$.get(domainUrl + "/getSolution", {}, function (data, status) {

			// Clear the container first (optional, depends on the scenario)
			container.empty();

			if (data.length === 0) {
				container.append('<h4 style="text-align: center;">There are no orders to display<h4>');
			} else {

				// Loop over each solution and create a tile
				data.forEach(solution => {
					const tile = `
						<div class="tile" data-solution-id="${solution._id}">
							<div class="tile-content">
								<div class="tile-title">${solution.solutionHeading}</div>
								<div class="tile-rating">${generateStars(solution.rating)}</div>
								<div class="tile-description">${solution.description}</div>
							</div>
							<div class="bookmark-icon">
								<img src="img/favourites.png" alt="Bookmark Icon">
							</div>
						</div>
					`;

					// Append the tile to the container
					container.append(tile);
				});
			}
		});

		// Click event for viewing solution details
		container.on('click', '.tile', function () {
			$('#solutionDetails').html("");
			const solutionId = $(this).data('solution-id');

			// Fetch the full details of the clicked solution
			$.get(domainUrl + "/getSolutionById", {
				_id: solutionId
			}, function (solutionDetails, status) {
				if (status === "success") {

					localStorage.removeItem("solutionId");
					localStorage.setItem("solutionId", solutionId);

					$('#solutionHeading').text(solutionDetails.solutionHeading);
					$('#solutionType').text(solutionDetails.solutionType);
					$('#solutionRating').html(generateStars(solutionDetails.rating)); // Function to generate stars
					$('#solutionDescription').text(solutionDetails.description);
					$('#solutionInstructions').text(solutionDetails.instructions);
					// Optionally, handle the photos
					$('#solutionPhotos').empty(); // Clear previous photos

					$('#solutionPhotos').append(`<img src="${solutionDetails.photo}" alt="Solution Photo" class="tile-photo">`);

					// Navigate to the View Solution page
					$.mobile.changePage("#viewSolutionPage");

				} else {
					alert("Failed to retrieve solution details");
				}
			});
		});
	});

	/**
	--------------------------end--------------------------
	**/

	/**
	----------------------Event handler to process proffesional user home page request----------------------
	**/

	$(document).on("pagebeforeshow", "#profHomePage", function displayProfOrders() {

		var userInfo = JSON.parse(localStorage.getItem("userInfo"));
		if (!userInfo) {
			$.mobile.changePage("#loginPage");
		} else if (userInfo.userType === "PUBLIC_USER") {
			$.mobile.changePage("#homePage");
		}

		$('#profSearchInput').val('');
		const container = $('#profTilesContainer'); // The container where tiles will be injected
		$('#ratingSolutionButton').hide();

		$.get(domainUrl + "/getSolution", {}, function (data, status) {

			// Clear the container first (optional, depends on the scenario)
			container.empty();

			if (data.length === 0) {
				container.append('<h4 style="text-align: center;">There are no orders to display<h4>');
			} else {

				// Loop over each solution and create a tile
				data.forEach(solution => {
					const tile = `
						<div class="tile" data-solution-id="${solution._id}">
							<div class="tile-content">
								<div class="tile-title">${solution.solutionHeading}</div>
								<div class="tile-rating">${generateStars(solution.rating)}</div>
								<div class="tile-description">${solution.description}</div>
							</div>
							<div class="bookmark-icon">
								<img src="img/favourites.png" alt="Bookmark Icon">
							</div>
						</div>
					`;

					// Append the tile to the container
					container.append(tile);
				});
			}

		});

		// Click event for viewing solution details
		container.on('click', '.tile', function () {
			$('#solutionDetails').html("");
			const solutionId = $(this).data('solution-id');

			// Fetch the full details of the clicked solution
			$.get(domainUrl + "/getSolutionById", {
				_id: solutionId
			}, function (solutionDetails, status) {
				if (status === "success") {

					localStorage.removeItem("solutionId");
					localStorage.setItem("solutionId", solutionId);

					$('#solutionHeading').text(solutionDetails.solutionHeading);
					$('#solutionType').text(solutionDetails.solutionType);
					$('#solutionRating').html(generateStars(solutionDetails.rating)); // Function to generate stars
					$('#solutionDescription').text(solutionDetails.description);
					$('#solutionInstructions').text(solutionDetails.instructions);
					// Optionally, handle the photos
					$('#solutionPhotos').empty(); // Clear previous photos

					$('#solutionPhotos').append(`<img src="${solutionDetails.photo}" alt="Solution Photo" class="tile-photo">`);

					// Navigate to the View Solution page
					$.mobile.changePage("#viewSolutionPage");

				} else {
					alert("Failed to retrieve solution details");
				}
			});
		});
	});

	/**
	----------------------When the upload icon is clicked, trigger the hidden file input----------------------
	**/

	$('#upload-icon').on('click', function () {
		$('#file-input').click();
	});

	// On file input change, show the selected file name and preview the image
	$('#file-input').on('change', function (event) {
		const file = event.target.files[0];
		if (file) {
			$('#file-name').text(file.name);
			const reader = new FileReader();
			localStorage.removeItem("imageByteCode");
			reader.onload = function (e) {
				const base64String = e.target.result;
				localStorage.setItem("imageByteCode", base64String);
				$('#file-preview').attr('src', e.target.result);
			};
			reader.readAsDataURL(file);
			$('#delete-file-btn').show();
		}
	});

	// Remove the file on clicking the delete button
	$('#delete-file-btn').on('click', function () {
		$('#file-input').val('');
		$('#file-name').text('No selected file');
		$('#file-preview').attr('src', '');
		$(this).hide();
	});

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Event handler to respond to signUp Button----------------------
	**/

	$('#signUpButton').click(function () {

		localStorage.removeItem("signUpData");

		// Serialize form data automatically as an array of name-value pairs
		var formArray = $("#signUpForm").serializeArray();

		// Convert the array into an object for easy handling
		var formData = {};
		var haveValues = true;

		$.each(formArray, function (i, field) {
			formData[field.name] = field.value;
			if (field.value.trim() == "") { // If any value is not empty
				haveValues = false;
			}
		});

		formData["userType"] = "PUBLIC_USER";
		// Store form data into localStorage for later use
		localStorage.setItem("signUpData", JSON.stringify(formData));
		console.log(localStorage.signUpData);

		var inputData = {};
		inputData["email"] = formData["email"];

		$.post(domainUrl + "/verifyUserEmailExist", inputData, function (data, status) {
			if (status === "success") {
				if (haveValues && data.length === 0) {
					var signUpData = JSON.parse(localStorage.getItem("signUpData"));
					console.log("Data:", signUpData);
					$.post(domainUrl + "/addUser", signUpData, function (data, status) {
						if (status === "success") {
							alert("Signup success");
							$.mobile.changePage("#loginPage");
						} else {
							alert("Signup failed");
						}
						$("#signUpForm").trigger('reset');
					});
				} else if (data.length > 0) {
					alert("User Email already exists");
					$("#signUpForm").trigger('reset');
				} else {
					alert("Signup failed");
				}
			} else {
				alert("Error verifying user");
			}
		});

	});

	/**
	--------------------------end--------------------------
	**/

	/**
	--------------------Signup form JQuery validation plugin----------------------
	**/

	$("#signUpForm").validate({
		focusInvalid: false,
		onkeyup: false,
		submitHandler: function (form) {

			var formData = $(form).serializeArray();
			var signUpData = {};
			formData.forEach(function (data) {
				signUpData[data.name] = data.value;
			})

			localStorage.setItem("signUpData", JSON.stringify(signUpData));
		},
		/* Validation rules */
		rules: {
			email: {
				required: true,
				email: true
			},
			password: {
				required: true,
				rangelength: [3, 10]
			},
			fullName: {
				required: true,
				rangelength: [1, 15],
				validateName: true
			},
			phoneNumber: {
				required: true,
				mobiletxt: true
			}
		},
		/* Validation message */
		messages: {
			email: {
				required: "Please enter your email",
				email: "The email format is incorrect"
			},
			password: {
				required: "Password cannot be empty",
				rangelength: $.validator.format("Minimum Password Length:{0}, Maximum Password Length:{1}。")

			},
			fullName: {
				required: "Please enter your full name",
				rangelength: $.validator.format("Contains a maximum of{1}characters"),

			},
			phoneNumber: {
				required: "Phone number required",
			},
		},
	});

	/**
	--------------------------end--------------------------
	**/

	/**
	----------------------Event handler when the raing is submitted----------------------
	**/

	$(document).on('submit', '#ratingForm', function (e) {
		e.preventDefault();

		// Get the selected rating
		const selectedRating = $("input[name='rating']:checked").val();

		if (selectedRating) {

			var userInfo = JSON.parse(localStorage.getItem("userInfo"));
			var inputData = {};
			inputData["user_id"] = userInfo._id;
			inputData["solution_id"] = localStorage.getItem("solutionId");
			inputData["rating"] = selectedRating;
			$.post(domainUrl + "/addSolutionRating", inputData, function (data, status) {
				if (status === "success") {
					alert("Thank You for your valubale Rating. You rated: " + selectedRating + " for this Solution.");
					$("#ratingModal").popup("close");
				} else {
					alert("Error Saving Ratings.");
				}
			});
			$("#ratingModal").popup("close");
		} else {
			alert("Please select a rating.");
		}
	});

	/**
	----------------------Event Handler for View Solution Page----------------------
	**/

	$(document).on("pagebeforeshow", "#viewSolutionPage", function displaySolution() {

		var userInfo = JSON.parse(localStorage.getItem("userInfo"));
		var solutionId = localStorage.getItem("solutionId");

		$.get(domainUrl + "/getUserSolutionRating", {
			solutionId: solutionId, userId: userInfo._id
		}, function (solutionDetails, status) {
			if (status === "success") {
				if (solutionDetails === "[]") {
					$('#ratingSolutionButton').show();
				}
			}
		});
	});

	/**
	----------------------Event Handler for Search Functionality----------------------
	**/

	$('#searchButton').on('click', function () {

		const container = $('#tilesContainer'); // The container where tiles will be injected
		$('#ratingSolutionButton').hide();

		var searchParam = $('#searchInput').val();

		if (searchParam) {

			$.get(domainUrl + "/searchSolution", { searchParam: searchParam }, function (data, status) {

				// Clear the container first (optional, depends on the scenario)
				container.empty();

				if (data.length === 0) {
					container.append('<h4 style="text-align: center;">There are no orders to display<h4>');
				} else {

					// Loop over each solution and create a tile
					JSON.parse(data).forEach(solution => {
						const tile = `
						<div class="tile" data-solution-id="${solution._id}">
							<div class="tile-content">
								<div class="tile-title">${solution.solutionHeading}</div>
								<div class="tile-rating">${generateStars(solution.rating)}</div>
								<div class="tile-description">${solution.description}</div>
							</div>
							<div class="bookmark-icon">
								<img src="img/favourites.png" alt="Bookmark Icon">
							</div>
						</div>
					`;

						// Append the tile to the container
						container.append(tile);
					});
				}

			});

			// Click event for viewing solution details
			container.on('click', '.tile', function () {
				$('#solutionDetails').html("");
				const solutionId = $(this).data('solution-id');

				// Fetch the full details of the clicked solution
				$.get(domainUrl + "/getSolutionById", {
					_id: solutionId
				}, function (solutionDetails, status) {
					if (status === "success") {

						localStorage.removeItem("solutionId");
						localStorage.setItem("solutionId", solutionId);

						$('#solutionHeading').text(solutionDetails.solutionHeading);
						$('#solutionType').text(solutionDetails.solutionType);
						$('#solutionRating').html(generateStars(solutionDetails.rating)); // Function to generate stars
						$('#solutionDescription').text(solutionDetails.description);
						$('#solutionInstructions').text(solutionDetails.instructions);
						// Optionally, handle the photos
						$('#solutionPhotos').empty(); // Clear previous photos

						$('#solutionPhotos').append(`<img src="${solutionDetails.photo}" alt="Solution Photo" class="tile-photo">`);

						// Navigate to the View Solution page
						$.mobile.changePage("#viewSolutionPage");

					} else {
						alert("Failed to retrieve solution details");
					}
				});
			});
		}
	});

	/**
	----------------------Event Handler for Proffesional User search functionality----------------------
	**/

	$('#profSearchButton').on('click', function () {

		const container = $('#profTilesContainer'); // The container where tiles will be injected
		$('#ratingSolutionButton').hide();

		var searchParam = $('#profSearchInput').val();

		if (searchParam) {

			$.get(domainUrl + "/searchSolution", { searchParam: searchParam }, function (data, status) {

				// Clear the container first (optional, depends on the scenario)
				container.empty();

				if (data.length === 0) {
					container.append('<h4 style="text-align: center;">There are no orders to display<h4>');
				} else {

					// Loop over each solution and create a tile
					JSON.parse(data).forEach(solution => {
						const tile = `
						<div class="tile" data-solution-id="${solution._id}">
							<div class="tile-content">
								<div class="tile-title">${solution.solutionHeading}</div>
								<div class="tile-rating">${generateStars(solution.rating)}</div>
								<div class="tile-description">${solution.description}</div>
							</div>
							<div class="bookmark-icon">
								<img src="img/favourites.png" alt="Bookmark Icon">
							</div>
						</div>
					`;

						// Append the tile to the container
						container.append(tile);
					});
				}

			});

			// Click event for viewing solution details
			container.on('click', '.tile', function () {
				$('#solutionDetails').html("");
				const solutionId = $(this).data('solution-id');

				// Fetch the full details of the clicked solution
				$.get(domainUrl + "/getSolutionById", {
					_id: solutionId
				}, function (solutionDetails, status) {
					if (status === "success") {

						localStorage.removeItem("solutionId");
						localStorage.setItem("solutionId", solutionId);

						$('#solutionHeading').text(solutionDetails.solutionHeading);
						$('#solutionType').text(solutionDetails.solutionType);
						$('#solutionRating').html(generateStars(solutionDetails.rating)); // Function to generate stars
						$('#solutionDescription').text(solutionDetails.description);
						$('#solutionInstructions').text(solutionDetails.instructions);
						// Optionally, handle the photos
						$('#solutionPhotos').empty(); // Clear previous photos

						$('#solutionPhotos').append(`<img src="${solutionDetails.photo}" alt="Solution Photo" class="tile-photo">`);

						// Navigate to the View Solution page
						$.mobile.changePage("#viewSolutionPage");

					} else {
						alert("Failed to retrieve solution details");
					}
				});
			});
		} else {

			var userInfo = JSON.parse(localStorage.getItem("userInfo"));
			if (userInfo.userType === "PROFFESIONAL_USER") {
				$.mobile.changePage("#profHomePage");
			} else if (userInfo.userType === "PUBLIC_USER") {
				$.mobile.changePage("#homePage");
			}
		}
	});

	/**
	----------------------Onclick functionality for Favorites----------------------
	**/
	$('#favouritesButton').on('click', function () {
		alert('Favorites Screen is in progress. Stay Tuned!');
	});

	/**
	----------------------Onclick functionality for Home----------------------
	**/
	$('#homeButton').on('click', function () {
		$.mobile.changePage("#homePage");
		location.reload();
	});

	/**
	----------------------Onclick functionality for Home----------------------
	**/
	$('#profHomeButton').on('click', function () {
		$.mobile.changePage("#profHomePage");
		location.reload();
	});

	/**
	----------------------Onclick functionality for Settings----------------------
	**/
	$('#settingsButton').on('click', function () {
		alert('Settings Screen is in progress. Stay Tuned!');
	});

	/**
	----------------------Profile dropdown functionality----------------------
	**/
	$('#profileButton').on('click', function (event) {
		var userInfo = JSON.parse(localStorage.getItem("userInfo"));
		$('#profileName').text(userInfo.fullName);
		event.preventDefault(); // Prevent default link behavior
		$('#profileDropdown').toggle(); // Toggle dropdown visibility
	});

	/**
	----------------------Proffesional user Profile dropdown functionality----------------------
	**/
	$('#profProfileButton').on('click', function (event) {
		var userInfo = JSON.parse(localStorage.getItem("userInfo"));
		$('#profProfileName').text(userInfo.fullName);
		event.preventDefault(); // Prevent default link behavior
		$('#profProfileDropdown').toggle(); // Toggle dropdown visibility
	});

	/**
	----------------------Hide dropdown if clicked outside----------------------
	**/
	$(document).on('click', function (event) {
		if (!$(event.target).closest('#profileButton, #profileDropdown').length) {
			$('#profileDropdown').hide();
		}
	});

});

