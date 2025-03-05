import React from 'react'



// function SignUp() {
//     return (
//         <div>
//             SignUp
//         </div>
//     )
// }

//----------------------------------------------------

function Button({value}) {
    return (
      <button 
        onClick={() => preventDefault(e)}
        className="mt-6 transition transition-all block py-3 px-4 w-full text-white font-bold rounded cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-400 hover:from-indigo-700 hover:to-purple-500 focus:bg-indigo-900 transform hover:-translate-y-1 hover:shadow-lg">
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
  
  function SignUp() {
    return (
      <div className="bg-gray-200 flex justify-center items-center h-screen w-screen">
        <div className=" border-t-8 rounded-sm border-indigo-600 bg-white p-12 shadow-2xl w-96">
          <h1 className="font-bold text-center block text-2xl">Sign Up</h1>      
          <form>
          <Input type="name" name="name" label="User Name" placeholder="Name" autofocus={true}/>
          <Input type="email" id="email" name="email" label="Email Address" placeholder="me@example.com" autofocus={true}/>
          <Input type="password" id="password" name="password" label="Password" placeholder="••••••••••" />
          <Input type="password" id="password" name="password" label="Confirm Password" placeholder="••••••••••" />
          <Button value="Signup" />
          <p className='p-2'>
          Already have account?{" "}
          <a className="blue" href="/login">
            Signin
          </a>
          </p> 
          </form>
        </div>
      </div>
    )
  }

export default SignUp
