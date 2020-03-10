console.log("front-end");
console.log(sessionStorage);
let url;

$(document).ready(function(){
  $('#loginForm').hide();
  $('#logoutBtn').hide();
  $('#productForm').hide();
  $('#manipulate').hide();
  $('#registerForm').hide();
  $('#viewUserBtn').hide();

  if (sessionStorage['userName']) {
    console.log('You are logged in');
    $('#manipulate').show();
    $('#loginBtn').hide();
    $('#logoutBtn').show();
    $('#registerBtn').hide();
    $('#viewUserBtn').show();

  } else {
    console.log('Please login');
    // $('#registerBtn').show();
    // ('#loginBtn').show();
    $('#logoutBtn').hide();
    $('#viewUserBtn').hide();
  }

  //checking if jquery node_modules work properly when you set up
  $('#heading').click(function(){
    // $(this).css('background', 'teal');
  });



  $('#loginBtn').click(function(){
    $('#loginForm').show();

  });
  $('#adminPage').hide();
  $('#adminBtn').click(function(){
    $('#adminPage').show();
    $('#homePage').hide();
    $('#loginBtn').show();
    $('#registerBtn').show();
  });
  $('#homeBtn').click(function(){
    $('#adminPage').hide();
    $('#homePage').show();
  });

//get url and port from config.json
  $.ajax({
    url :'config.json',
    type :'GET',
    dataType :'json',
    success : function(configData){
      console.log(configData);
      url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
      console.log(url);

    },//success
    error:function(){
      console.log('error: cannot call api');
    }//error
  });//ajax

  $('#viewUserBtn').click(function(){
    $.ajax({
      url :`${url}/allUsers`,
      type :'GET',
      dataType :'json',
      success : function(usersFromMongo){

        for(let i=0; i<usersFromMongo.length; i++){
          console.log(usersFromMongo[i].username);
        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error
    });//ajax
  });//viewUser button

  $('#viewProducts').click(function(){
    console.log('viewProducts clicked');//checking if button click responds
    $.ajax({
      url :`${url}/allProductsFromDB`,
      type :'GET',
      dataType :'json',
      success : function(productsFromMongo){
        console.log(productsFromMongo);
        document.getElementById('productCards').innerHTML = "";

        for(let i=0; i<productsFromMongo.length; i++){
          document.getElementById('productCards').innerHTML +=
          `<div class="col-3 border rounded-pill mr-5 mb-5 px-5 py-3">
          <h3 class=""> ${productsFromMongo[i].name}</h3>
          <h4 class="">${productsFromMongo[i].price}</h4>
          </div>`;

        }


      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error


    });//ajax
  });//viewProduct button

  //updateProduct
  $('#updateProductBtn').click(function(){
      $('#productForm').show();
  });
  $('#productForm').submit(function(){


    event.preventDefault();

    let  productId = $('#productId').val();
    let  productName = $('#productName').val();
    let  productPrice = $('#productPrice').val();
    let  userId = $('#userId').val();

    console.log(productId, productName, productPrice, userId);
    if (productId == '') {
      alert('Please enter product details');
    } else { $.ajax({
            url :`${url}/updateProduct/${productId}`,
            type :'PATCH',
            data:{
              name : productName,
              price :productPrice,
              userId : userId
              },
            success : function(data){
              console.log(data);
              $('#productId').val('');
              $('#productName').val('');
              $('#productPrice').val('');
              $('#userId').val('');
            },//success
            error:function(){
              console.log('error: cannot call api');
            }//error


          });//ajax
    }
  });//submit function for update product


//register new user
  $('#registerBtn').click(function(){
    $('#registerForm').show();
  });


  $('#loginForm').submit(function(){

    event.preventDefault();
    let username = $('#username').val();
    let password = $('#password').val();
    console.log(username,password);
    $.ajax({
      url :`${url}/loginUser`,
      type :'POST',
      data:{
        username : username,
        password : password
        },
      success : function(loginData){
        console.log(loginData);
        if (loginData === 'user not found. Please register' ) {
          alert ('Register please');
        } else {
          sessionStorage.setItem('userId',loginData['_id']);
          sessionStorage.setItem('userName',loginData['username']);
          sessionStorage.setItem('userEmail',loginData['email']);
          console.log(sessionStorage);
          $('#manipulate').show();
          $('#username').val('');
          $('#loginBtn').hide();
          $('#logoutBtn').show();
          $('#loginForm').hide();
          $('#registerBtn').hide();
          $('#viewUserBtn').show();
        }
      },//success
      error:function(){
        console.log('error: cannot call api');
      }//error


    });//ajax

  });//submit function for login loginForm



  //logout

$('#logoutBtn').click(function(){
  console.log('You are logged out');
  sessionStorage.clear();
  console.log(sessionStorage);
  $('#manipulate').hide();
  $('#loginBtn').show();
  $('#logoutBtn').hide();
  $('#registeBtn').show();
  $('#viewUserBtn').hide();
});


});//document.ready
