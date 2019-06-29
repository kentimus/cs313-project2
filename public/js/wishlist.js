$(document).ready(function(){
    $("#sign-up-form").on("submit", function(event){
        event.preventDefault();
        const username = $("#signup-username").val();
        const email    = $("#signup-email").val();
        const password = $("#signup-password").val();
        
        $.get('/add-new-user', {
                'username' : username,
                'email'    : email,
                'password' : password
			} , function(data){
				if(data.success === true){
                    // make some changes to dom based on signed in user
                    $("#product-search-username").text(data.username);
                    $("#global-username").val(data.username);
                    $("#view-link").attr("href", "/view/" + data.username);
                    
                    // hide sign in form, show product search form
                    $("#signin-container").fadeOut(400, 'swing', function(){
                        $("#product-search").fadeIn();
                    });
                } else {
                    alert("there was an error");
                }
				
			}, 'json'
		)
    });
    
    $("#sign-in-form").on("submit", function(event){
        event.preventDefault();
        const username = $("#signin-username").val();
        const password = $("#signin-password").val();
        
        $.get('/sign-in', {
                'username' : username,
                'password' : password
			} , function(data){
				if(data.success === true){
                    // make some changes to dom based on signed in user
                    $("#product-search-username").text(data.username);
                    $("#global-username").val(data.username);
                    $("#view-link").attr("href", "/view/" + data.username);
                    
                    // hide sign in form, show product search form
                    $("#signin-container").fadeOut(400, 'swing', function(){
                        $("#product-search").fadeIn();
                    });
                } else {
                    let message = "<div class='alert alert-warning'><p>" + data.message + "</p></div>"
                    $("#signin-alert").html(message);
                }
			}, 'json'
		)
    });
    
    $("#search-box").on("keyup", function(){
        // this event listener will query Walmarts product search api
        
        let message = "<div class='alert alert-warning'><p><strong>Oh No!</strong>The searchbar doesn't work yet!</p></div>";
        $("#results-container").html(message); 
    });
});