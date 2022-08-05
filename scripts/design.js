var startServerButton = document.querySelector(".startServerButton");
var formHandler = document.querySelector(".formHandler");
var startServerButtonDiv = document.querySelector(".linkParent");
var serverIDInput = document.querySelector(".serverID");
var submitButton = document.querySelector(".submitButton");

if(window.location.pathname == "/" || window.location.pathname == "/index.html"){
    $(document).ready(function(){
       $(".overlay").animate({
           opacity: 0.8
       }, 1200).delay(800).promise().done(function(){
           $(".mainTitle").animate({
               opacity: 1
           }, 400).promise().done(function(){
               $(".startServerButton").animate({
                   opacity: 1
               }, 400)
           })
       })
    })
}

$(".startServerButton").click(function(){
    $(".mainTitle").animate({
        opacity: 0
    }, 400).promise().done(function(){
        $(".startServerButton").animate({
            opacity: 0
        }, 400).promise().done(function(){
            startServerButton.style.visibility = "hidden";
            $(".mainTitle").html("Server ID")
            $(".mainTitle").animate({
                opacity: 1
            }, 400).promise().done(function(){
                startServerButtonDiv.style.display = "none";
                startServerButtonDiv.style.visibility = "hidden";
                formHandler.style.visibility = "initial";
                formHandler.style.opacity = 1;
                serverIDInput.style.visibility = "initial";
                submitButton.style.visibility = "initial";
                $(".serverID").animate({
                    opacity: 1
                }, 400).promise().done(function(){
                    $(".submitButton").animate({
                        opacity: 1
                    }, 400)
                })
            })
        })
    })
})