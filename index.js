const firebaseConfig = {
    apiKey: "AIzaSyAVPElHXGW3MosL-Q7MdcoHnHVO41vVAm0",
    authDomain: "placement-portal-f255f.firebaseapp.com",
    projectId: "placement-portal-f255f",
    storageBucket: "placement-portal-f255f.appspot.com",
    messagingSenderId: "331903282276",
    appId: "1:331903282276:web:1a288b64c9555c356b4371"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = firebase.auth()
  const database = firebase.database()
   
function register(){
 
  email = document.getElementById('email').value
  password = document.getElementById('password').value
}
if ( validate_email(email)==false || validate_password(password)==false){
    alert('Email or password is outta line')
    return
}
// if (Validate_input( full_name) ==false || validate_input(full_name) ==false || validate_input (full_name) ==fal(se)

auth.createUserWithEmailAndPassword(email,password)
.then(function(){
    var user =auth.currentUser
    var database_ref = database.ref()

    var user_data ={
        email: email,
        full_name : full_name,
        last_login : Date.now()
    }
    database_ref.child('user/'+user.uid).set(user_data)



    alert('User Created')

})
.catch(function(console.error){
    var error_code= error.error_code
    var error_message=error.error.message 

    alert( erroe_message)
})
function validate_email(email){
    expression =/^[^@]+@\w+(\.\w+)+\w$/
    if ( expression.test(email)== true){
        return true

    } else {
        return false
    }
}
function validate_password( password){
 if ( password< 8){
    return false 
 }   else {
    return true
 }
}
 
 function validate_input( input){
    if ( input ==null){
        return false
     }else {
         return true
     }
 }
