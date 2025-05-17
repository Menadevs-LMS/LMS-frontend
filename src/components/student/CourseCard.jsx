import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../../assets/assets'
 
const CourseCard = () => {
 
    const dummyData = [
        {
          img: "https://fstacademy.com/wp-content/uploads/2022/07/Free-Courses-to-learn-JavaScript.jpg",
          title: "JavaScript Basics",
          p1: "profisional",
          p2: 20,
          p3: 30,
          p4: "JavaScript is a scripting or programming language that allows you to implement complex features on web pages — every time a web page does more than just sit there and display static information for you to look at — displaying timely content updates, interactive maps."
        },
        {
          img: "https://img-c.udemycdn.com/course/750x422/2314160_8d61_6.jpg",
          title: "Python for Beginners",
          p1: "python",
          p2: 25,
          p3: 35,
          p4: "Python is an open source community language, so numerous independent programmers are continually building libraries and functionality for it."
        },
        {
          img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWcn7c60RqoEdTbwlDxVhkoQOxFjutFRfuNw&s",
          title: "Web Development Bootcamp",
          p1: "web Development",
          p2: 22,
          p3: 32,
          p4: "Web development, also known as website development, refers to the tasks associated with creating, building, and maintaining websites and web applications that run online on a browser."
        },
        {
          img: "https://cdn.shopaccino.com/igmguru/products/react-with-redux-igmguru_757545985_l.jpg?v=531",
          title: "React & Redux",
          p1: "React",
          p2: 28,
          p3: 38,
          p4: "React lets you describe your UI as a function of your state, and Redux contains state and updates it in response to actions."
        }
      ];
     
    return (
        <>
       
    {dummyData.map((i)=>
        <Link to="/coursedetails"  className="border border-gray-500/30 pb-6 overflow-hidden rounded-lg">
            <img className="w-full"  alt='' src={i.img}/>
            <div className="p-3 text-left">
                <h3 className="text-base font-semibold">{i.title}</h3>
                <p className="text-gray-500">{i.p1}</p>
                <div className="flex items-center space-x-2">
                    <p>{i.p2}</p>
                    <div className="flex">
                       
                            <img
                               
                                className="w-3.5 h-3.5"
                                src={ assets.star }
                                alt=""
                            />
                     
                    </div>
                    <p className="text-gray-500">{i.p3}</p>
                </div>
                <p className="text-base font-semibold text-gray-600">{i.p4}</p>
            </div>
        </Link>)}
        </>
    )
}
 
export default CourseCard
 