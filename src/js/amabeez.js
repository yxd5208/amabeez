// Initialize Firebase
var config = {
  apiKey: "AIzaSyDTsP7esFyXJU3uEoTUmmDPbDzZRR5WpWA",
  authDomain: "amabeez-3e4ce.firebaseapp.com",
  databaseURL: "https://amabeez-3e4ce.firebaseio.com",
  projectId: "amabeez-3e4ce",
  storageBucket: "",
  messagingSenderId: "568625540406"
};

firebase.initializeApp(config);
const auth = firebase.auth();
var database = firebase.database();
//keep track of userid
var uid;
var net_strop = 0;
jQuery(document).ready(function(){
  $(".home_page").hide();
  $(".foot_bottom").hide();
  $(".discussion_page").hide(0);
  $(".btn_logout_container").hide();
  $(".signup_page").hide();
  toggleLabels(label_im, num0);
});
//variables to represent elements
//discuss page
var slider = document.getElementById("myRange");
var label_drop = document.getElementById("slider-2");
var label_bdrop= document.getElementById("slider-1");
var label_im = document.getElementById("slider0");
var label_bup = document.getElementById("slider1");
var label_up = document.getElementById("slider2");
var num_drop = document.getElementById("num-2");
var num_bdrop = document.getElementById("num-1");
var num_im = document.getElementById("num0");
var num_bup = document.getElementById("num1");
var num_up = document.getElementById("num2");
//login / signup page
const txtEmail = document.getElementById("txtEmail");
const txtPassword = document.getElementById("txtPassword");
const signup_txtEmail = document.getElementById("signup_txtEmail");
const signup_txtPassword = document.getElementById("signup_txtPassword");
const discuss_progress_bar = document.getElementById("discuss_progress");
var btn_logout = document.getElementById("btn_logout");
//other important global vars;
var num_curr_users = 0;

$("#btn_mem_signup").click(function(){
   $(".login_page").hide(0);
   $(".signup_page").show();
});

$("#btn_mem_login").click(function(){
  //authorization here
  const email = txtEmail.value;
  const password = txtPassword.value;
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION) .then(function()
  {
      return firebase.auth().signInWithEmailAndPassword(email,password);
   })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.log(errorMessage);
    });
  });

$("#btn_signup_submit").click(function(){
    const email = signup_txtEmail.value;
    const password = signup_txtPassword.value;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    // ...
  });
});


//listen 4 any login / logout change
firebase.auth().onAuthStateChanged(firebaseUser=>{
   if(firebaseUser==null){
     console.log("Not logged in");
     var ref_curr_users = database.ref("current_users");
     ref_curr_users.update({
       [uid]:null
     });
   }
   else{
         console.log("logged in");
         $(".login_page").hide(500);
         $(".home_page").show(0);
         $(".foot_bottom").show();
         $(".btn_logout_container").show();
         $("#num_curr_display").html(num_curr_users);
         var ref_curr_users = database.ref("current_users");
         var name = auth.currentUser.displayName;
         var email = auth.currentUser.email;
         uid = auth.currentUser.uid;
         ref_curr_users.update({
          [uid] :{
                      strophold:0,
                    }
         });

         ref_curr_users.onDisconnect().update({
           [uid]:null
         });
   }
  });


  database.ref("current_users").on('value', function(snapshot) {
    num_curr_users = snapshot.numChildren()-1; //minus the place holder
    $("#num_curr_display").html(num_curr_users);
    net_strop=0;
    snapshot.forEach(function(childSnapshot) {
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData = childSnapshot.val();
      net_strop = net_strop+parseInt(childData.strophold);
  });


      var percent = (2*num_curr_users+parseInt(net_strop))/(4*num_curr_users)*100;
      console.log(percent);
      discuss_progress_bar.innerHTML = net_strop;
      discuss_progress_bar.style.width = percent+"%";
  });

$("#nav_discussion_btn").click(function(){
  $(".home_page").hide(0);
  $("#nav_discussion_btn").toggleClass("active");
  $(".discussion_page").show(0);
  // $("#nav_discussion_btn").prop('disabled', true);
});

btn_logout.addEventListener("click", function(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
      console.log("logged out successfully");
      $(".login_page").show();
      $(".home_page").hide();
      $(".foot_bottom").hide();
      $(".discussion_page").hide(0);
      $(".btn_logout_container").hide();
      $("#nav_discussion_btn").toggleClass("active");
  }).catch(function(error) {
    // An error happened.
  });
});

slider.addEventListener("change", function(){
  var read = slider.value;
  if(read==-2){
    toggleLabels(label_drop, num_drop);
  }
  else if(read==-1){
    toggleLabels(label_bdrop, num_bdrop);
  }
  else if(read==0){
    toggleLabels(label_im, num_im);
    }
  else if(read==1){
    toggleLabels(label_bup, num_bup);
  }
  else if(read==2){
    toggleLabels(label_up, num_up);
  }
  //update a user's personal count for strophold
  var ref_user = database.ref("current_users/"+uid);
  ref_user.update({
    strophold:read
  });
});
function toggleLabels(selected, bot){
    $(".label").removeClass("label_select");
    selected.classList.add("label_select");
    bot.classList.add("label_select");
}
