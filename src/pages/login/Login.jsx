import React from 'react'
import { Link } from 'react-router-dom'
// import './login.scss'
// import './styles.css'

// function Login() {
//   return (
//     <div>
//       <div id="root"></div>
//     </div>
//   )
// }

//---------------------------------------------------------------------

function Button({value}) {
  return (
    <button 
      onClick={() => preventDefault(e)}
      className="mt-6 transition transition- all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">
      {value}
  </button>
  )
}

function Input({type, id, name, label, placeholder, autofocus}) {
  return (
    <label className="text-gray-500 block mt-3">{label}
      <input
        autoFocus={autofocus}
        type={type} 
        id={id} 
        name={name}  
        placeholder={placeholder}
        className="rounded px-4 py-3 w-full mt-1 bg-white text-gray-900 border border-gray-200 focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-100"/>
    </label>
  )
}

function Login() {
  return (
    <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
      <div className=" border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
        <h1 className="font-bold text-center block text-2xl">Log In</h1>
        <form>
        <Input type="email" id="email" name="email" label="Email Address" placeholder="me@example.com" autofocus={true}/>
        <Input type="password" id="password" name="password" label="Password" placeholder="••••••••••" />
        <Button value="Login" />
        
        <p className='p-2'>
          Don't have an accoun?{" "}
          <a className="blue" href="/signup">
            Signup
          </a>
        </p>
          
        </form>
      </div>
    </div>
  )
}


// ReactDOM.render(
//   <LoginForm />, 
//   document.getElementById('root')
// );

//-----------------------------------------------------------------------

// const mode = 'login';

// class LoginComponent extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             mode: this.props.mode
//         }
//     }
//     toggleMode() {
//         var newMode = this.state.mode === 'login' ? 'signup' : 'login';
//         this.setState({ mode: newMode});
//     }
//     render() {
//         return (
//             <div>
//                 <div className={`form-block-wrapper form-block-wrapper--is-${this.state.mode}`} ></div>
//                 <section className={`form-block form-block--is-${this.state.mode}`}>
//                     <header className="form-block__header">
//                         <h1>{this.state.mode === 'login' ? 'Welcome back!' : 'Sign up'}</h1>
//                         <div className="form-block__toggle-block">
//                             <span>{this.state.mode === 'login' ? 'Don\'t' : 'Already'} have an account? Click here &#8594;</span>
//                             <input id="form-toggler" type="checkbox" onClick={this.toggleMode.bind(this)} />
//                             <label htmlFor="form-toggler"></label>
//                         </div>
//                     </header>
//                     <LoginForm mode={this.state.mode} onSubmit={this.props.onSubmit} />
//                 </section>
//             </div>
//         )
//     }
// }

// class LoginForm extends React.Component {
//     constructor(props) {
//         super(props);
//     }
//     render() {
//         return (
//         <form onSubmit={this.props.onSubmit}>
//             <div className="form-block__input-wrapper">
//                 <div className="form-group form-group--login">
//                     <Input type="text" id="username" label="user name" disabled={this.props.mode === 'signup'}/>
//                     <Input type="password" id="password" label="password" disabled={this.props.mode === 'signup'}/>
//                 </div>
//                 <div className="form-group form-group--signup">
//                     <Input type="text" id="fullname" label="full name" disabled={this.props.mode === 'login'} />
//                     <Input type="email" id="email" label="email" disabled={this.props.mode === 'login'} />
//                     <Input type="password" id="createpassword" label="password" disabled={this.props.mode === 'login'} />
//                     <Input type="password" id="repeatpassword" label="repeat password" disabled={this.props.mode === 'login'} />
//                 </div>
//             </div>
//             <button className="button button--primary full-width" type="submit">{this.props.mode === 'login' ? 'Log In' : 'Sign Up'}</button>
//         </form>
//         )
//     }
// }

// const Input = ({ id, type, label, disabled }) => (
//     <input className="form-group__input" type={type} id={id} placeholder={label} disabled={disabled}/>
// );

// const Login = () => (
//     <div className={`app app--is-${mode}`}>
//         <LoginComponent
//             mode={mode}
//             onSubmit={
//                 function() {
//                     console.log('submit');
//                 }
//             }
//         />
//     </div>
// );


//----------------------------------------------------------------------

// function SignInForm() {
//   const [state, setState] = React.useState({
//     email: "",
//     password: ""
//   });
//   const handleChange = evt => {
//     const value = evt.target.value;
//     setState({
//       ...state,
//       [evt.target.name]: value
//     });
//   };

//   const handleOnSubmit = evt => {
//     evt.preventDefault();

//     const { email, password } = state;
//     alert(`You are login with email: ${email} and password: ${password}`);

//     for (const key in state) {
//       setState({
//         ...state,
//         [key]: ""
//       });
//     }
//   };

//   return (
//     <div className="form-container sign-in-container">
//       <form onSubmit={handleOnSubmit}>
//         <h1>Sign in</h1>
//         <div className="social-container">
//           <a href="#" className="social">
//             <i className="fab fa-facebook-f" />
//           </a>
//           <a href="#" className="social">
//             <i className="fab fa-google-plus-g" />
//           </a>
//           <a href="#" className="social">
//             <i className="fab fa-linkedin-in" />
//           </a>
//         </div>
//         <span>or use your account</span>
//         <input
//           type="email"
//           placeholder="Email"
//           name="email"
//           value={state.email}
//           onChange={handleChange}
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={state.password}
//           onChange={handleChange}
//         />
//         <a href="#">Forgot your password?</a>
//         <button>Sign In</button>
//       </form>
//     </div>
//   );
// }

// function SignUpForm() {
//   const [state, setState] = React.useState({
//     name: "",
//     email: "",
//     password: ""
//   });
//   const handleChange = evt => {
//     const value = evt.target.value;
//     setState({
//       ...state,
//       [evt.target.name]: value
//     });
//   };

//   const handleOnSubmit = evt => {
//     evt.preventDefault();

//     const { name, email, password } = state;
//     alert(
//       `You are sign up with name: ${name} email: ${email} and password: ${password}`
//     );

//     for (const key in state) {
//       setState({
//         ...state,
//         [key]: ""
//       });
//     }
//   };

//   return (
//     <div className="form-container sign-up-container">
//       <form onSubmit={handleOnSubmit}>
//         <h1>Create Account</h1>
//         <div className="social-container">
//           <a href="#" className="social">
//             <i className="fab fa-facebook-f" />
//           </a>
//           <a href="#" className="social">
//             <i className="fab fa-google-plus-g" />
//           </a>
//           <a href="#" className="social">
//             <i className="fab fa-linkedin-in" />
//           </a>
//         </div>
//         <span>or use your email for registration</span>
//         <input
//           type="text"
//           name="name"
//           value={state.name}
//           onChange={handleChange}
//           placeholder="Name"
//         />
//         <input
//           type="email"
//           name="email"
//           value={state.email}
//           onChange={handleChange}
//           placeholder="Email"
//         />
//         <input
//           type="password"
//           name="password"
//           value={state.password}
//           onChange={handleChange}
//           placeholder="Password"
//         />
//         <button>Sign Up</button>
//       </form>
//     </div>
//   );
// }



// function Login() {
//   const [type, setType] = useState("signIn");
//   const handleOnClick = text => {
//     if (text !== type) {
//       setType(text);
//       return;
//     }
//   };
//   const containerClass =
//     "container " + (type === "signUp" ? "right-panel-active" : "");
//   return (
//     <div className="App">
//       <h2>Sign in/up Form</h2>
//       <div className={containerClass} id="container">
//         <SignUpForm />
//         <SignInForm />
//         <div className="overlay-container">
//           <div className="overlay">
//             <div className="overlay-panel overlay-left">
//               <h1>Welcome Back!</h1>
//               <p>
//                 To keep connected with us please login with your personal info
//               </p>
//               <button
//                 className="ghost"
//                 id="signIn"
//                 onClick={() => handleOnClick("signIn")}
//               >
//                 Sign In
//               </button>
//             </div>
//             <div className="overlay-panel overlay-right">
//               <h1>Hello, Friend!</h1>
//               <p>Enter your personal details and start journey with us</p>
//               <button
//                 className="ghost "
//                 id="signUp"
//                 onClick={() => handleOnClick("signUp")}
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

//-------------------------------------------------------------------------
export default Login
