import React, { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import firebaseConfig from './firebaseConfig';
firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: ''
  })

  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () => {
    firebase.auth().signInWithPopup(provider)
      .then(res => {
        const { displayName, photoURL, email } = res.user;
        const isSignedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL
        }
        setUser(isSignedInUser);
      })
      .catch(err => {
        console.log(err);
        console.log(err.message);
      })

  }
  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(res => {
        const signOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          password: '',
          error: '',
          isValid: false,
          exitingUser: false
        }
        setUser(signOutUser);
      }).catch(err => {

      });
  }
  const is_valid_email = email => /(.+)@(.+){2,}\.(.+){2,}/.test(email);
  const hasNumber = input => /\d/.test(input);
  const switchForm = e => {
    const createUser = { ...user };
    createUser.exitingUser = e.target.checked;
    setUser(createUser);
  }

  const handleChange = e => {
    const newUserInfo = { ...user };
    //perform validation
    let isValid = true;
    if (e.target.name === "email") {
      isValid = is_valid_email(e.target.value);
    }
    if (e.target.name === "password") {
      isValid = e.target.value.length > 6 && hasNumber(e.target.value);
    }
    newUserInfo[e.target.name] = e.target.value;
    newUserInfo.isValid = isValid;
    setUser(newUserInfo);
  }
  const createAccount = (event) => {
    if (user.isValid) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createUser = { ...user };
          createUser.isSignedIn = true;
          createUser.error = '';
          setUser(createUser);
        })
        .catch(err => {
          console.log(err);
          const createUser = { ...user };
          createUser.error = err.message;
          createUser.isSignedIn = false;
          setUser(createUser);

        })
    }
    event.preventDefault();
    event.target.reset();
  }
  const signInUser = (event) => {
    if (user.isValid) {
      firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(res => {
          console.log(res);
          const createUser = { ...user };
          createUser.isSignedIn = true;
          createUser.error = '';
          setUser(createUser);
        })
        .catch(err => {
          console.log(err);
          const createUser = { ...user };
          createUser.error = err.message;
          createUser.isSignedIn = false;
          setUser(createUser);

        })
    }
    event.preventDefault();
    event.target.reset();
  }
  return (
    <div className="text-center">
      {
        user.isSignedIn ? <button onClick={handleSignOut} className="btn btn-primary">Sign out</button> : <button onClick={handleSignIn} className="btn btn-primary">Sign in</button>
      }
      {
        user.isSignedIn && <div>
          <p>Welcome ,{user.name}</p>
          <p>Email:{user.email}</p>
        </div>
      }
      <div className="sidenav">
        <div className="login-main-text">
          <h2>Application<br /> Login Page</h2>
          <p>Login or register from here to access.</p>
        </div>
      </div>

      <div className="main">
        <div className="col-md-6 col-sm-12">
          <input type="checkbox" name="switchForm" id="switchForm" onChange={switchForm} />
          <label htmlFor="switchForm">Returning User </label>
          <div>
            <form style={{ display: user.exitingUser ? 'block' : 'none' }} onSubmit={signInUser}>
              <br />
              <input onBlur={handleChange} type="text" name="email" placeholder="username" className="m-2" required />
              <br />
              <input onBlur={handleChange} type="password" name="password" placeholder="password" className="mb-2" required />
              <br />
              <input type="submit" className="btn btn-primary" value="Sign in" />
            </form>
          </div>
          <div>
            <form style={{ display: user.exitingUser ? 'none' : 'block' }} onSubmit={createAccount}>
              <input onBlur={handleChange} type="text" name="name" placeholder="Your name" className="m-2" required />
              <br />
              <input onBlur={handleChange} type="text" name="email" placeholder="username" className="m-2" required />
              <br />
              <input onBlur={handleChange} type="password" name="password" placeholder="password" className="mb-2" required />
              <br />
              <input type="submit" className="btn btn-primary" value="Create Account" />
            </form>
            {
              user.error && <p className="text-danger">{user.error}</p>
            }
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
