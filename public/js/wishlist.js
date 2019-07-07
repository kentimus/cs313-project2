$(document).ready(function(){
    //alert($("#global-username").val());
    if($("#global-username").val() != null && $("#global-username").val() != ""){
        $("#signin-container").hide();
        $("#product-search").show();
    }
    
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
                    
                    // change navbar to show signed in
                    let nav_part = "<li class='nav-item'><span class='navbar-text'>Welcome ";
                    nav_part += username +"</span></li><li class='nav-item'>";
                    nav_part += "<a class='nav-link log-out' href='#'>Log out</a></li>";
                    $("#navbar-right-ul").html(nav_part);
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
                    
                    // change navbar to show signed in
                    let nav_part = "<li class='nav-item'><span class='navbar-text'>Welcome ";
                    nav_part += username +"</span></li><li class='nav-item'>";
                    nav_part += "<a class='nav-link log-out' href='#'>Log out</a></li>";
                    $("#navbar-right-ul").html(nav_part);
                } else {
                    let message = "<div class='alert alert-warning'><p>" + data.message + "</p></div>"
                    $("#signin-alert").html(message);
                }
			}, 'json'
		)
    });
    
    $("#product-search-form").on("submit", function(event){
        event.preventDefault();
        const keywords = $("#search-box").val();
        
        $.get('/amazon', {
                'keywords' : keywords
            } , function(data){
                console.log(data);
                $("#results-container").html("");
                for(let i=0; i<data.length; i++){
                    if(typeof data[i].LargeImage !== 'undefined'){
                        let formattedprice = "";
                        let price = 0;
                        if(typeof data[i].ItemAttributes[0].ListPrice !== 'undefined'){
                            formattedprice = data[i].ItemAttributes[0].ListPrice[0].FormattedPrice[0];
                            price = data[i].ItemAttributes[0].ListPrice[0].Amount[0]
                        } 
                        
                        let message = "<div class='card'>";
                        message += "<div class='card-header'>";
                        message += data[i].ItemAttributes[0].Title;
                        message += "</div>";
                        message += "<div class='card-body'>";
                        message += "<img src='";
                        message += data[i].LargeImage[0].URL;
                        message += "' class='img-fluid'></div>";
                        message += "<div class='card-footer'>";
                        message += formattedprice;
                        message += "<br><button class='wishlist-button btn btn-primary' ";
                        message += "data-name='" + data[i].ItemAttributes[0].Title + "' ";
                        message += "data-price='" + price + "' ";
                        message += "data-url='" + data[i].DetailPageURL[0] + "' ";
                        message += "data-thumb='" + data[i].LargeImage[0].URL + "' ";
                        message += ">add to wishlist</button> ";
                        message += "<a href='";
                        message += data[i].DetailPageURL[0];
                        message += "' target='_blank' class='btn btn-secondary'>view on amazon</a> ";
                        message += "</div>";
                        message += "</div>";
                        $("#results-container").append(message);
                    }
                }
			}, 'json'
		);
    });
    
    $(document).on("click", ".log-out", function(event){
        event.preventDefault();
        $.get('/sign-out', {
            } , function(data){
                let nav_part = "<li class='nav-item'><a class='nav-link' href='/' >Log In</a></li>";
                $("#navbar-right-ul").html(nav_part);
                $("#product-search").fadeOut(400, 'swing', function(){
                    $("#signin-container").fadeIn();
                });
			}, 'html'
		); 
    });
    
    $(document).on("click", ".wishlist-button", function(event){
        event.preventDefault();
        let addButton = $(this);
        $.get('/add-to-wishlist', {
            'name'  : $(this).data('name'),
            'price' : Number($(this).data('price')) / 100,
            'url'   : $(this).data('url'),
            'thumb' : $(this).data('thumb')
        }, function(data){
            addButton.removeClass("btn-primary");
            addButton.addClass("btn-success");
            addButton.attr("disabled", true);
            addButton.text("item added");
        }, 'html');
    });
});