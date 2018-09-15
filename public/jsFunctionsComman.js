
function initFirebase(){
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyCh8QBwPYFnCFJCN3ZPNakyKisR0pZ666g",
      authDomain: "firstapp2point2.firebaseapp.com",
      databaseURL: "https://firstapp2point2.firebaseio.com",
      projectId: "firstapp2point2",
      storageBucket: "firstapp2point2.appspot.com",
      messagingSenderId: "337631977989"
    };
  //initalize firabase for web
    if (!firebase.apps.length) {
     firebase.initializeApp(config);
  }
  
    
    var provider = new firebase.auth.GoogleAuthProvider();
  console.log(provider);
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  provider.setCustomParameters({
    'login_hint': 'user@example.com'
  });
  
  
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // console.log(token)
    // The signed-in user info.
    var user = result.user;
    // console.log(user)
    var Data = getData()
    Data['AuthData'] = result;
setData(Data);

    // ...
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
  
  // firebase.auth().signInWithRedirect(provider);
  };


function getData() {
    var Data = sessionStorage.getItem('Data') ? JSON.parse(sessionStorage.getItem('Data')) : {};
    return Data;
};

function setData(Data) {
    sessionStorage.setItem('Data', JSON.stringify(Data));
};

function resetData() {
    sessionStorage.removeItem('Data');
};

function testValue(){
  return "Value";
}