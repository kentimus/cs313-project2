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
                    alert(data.username + " has been added");
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
                    alert(data.username + " has been found");
                } else {
                    alert(data.message);
                }
				
			}, 'json'
		)
    });
});