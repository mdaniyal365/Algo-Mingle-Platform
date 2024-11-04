import React from 'react'
import { useNavigate } from 'react-router';
import OutputDialog from '../components/OutputDialog';

const About = () => {
        const navigate = useNavigate();
  return (
    <div>
        <div className='flex justify-center items-center'>
            <img src="/logos/logo13.png" alt=""  className="mx-2 mr-2 h-[100px] tablet:h-[200px] "/>
            <img
            src="/logos/logo14.png"
            alt=""
            className="tablet:block h-[100px] ml-2 tablet:h-[200px]"
            />
        </div>
        <p className='text-center  font-lumanosimo font-bold  text-[20px] tablet:text-[50px]'>AlgoMingle.com</p>
        <p className='text-center font-poppins text-[10px] tablet:text-[16px]'>A comprehensive mock interview platform for tech folks</p>
        <p className='ml-10 text-[20px] mt-10  font-lumanosimo font-bold'>Who we are </p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>Welcome to AlgoMingle.com, the ultimate destination for students to hone their interview skills and showcase their talents. Whether you're preparing for mock interviews or participating in real interviews, our platform is designed to provide a seamless and integrated experience. With an inbuilt code editor and compilers, you can write, test, and run your code in real-time, all within the same interface.</p>
        <p className='ml-10 text-[20px] mt-4 font-lumanosimo font-bold '>Our Mission</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>Our mission is to bridge the gap between academic learning and real-world job requirements by providing students with a comprehensive platform to practice and excel in technical interviews. We believe that preparation is key to success, and our goal is to equip you with the tools and confidence needed to succeed in any interview scenario.</p>
        <p className='ml-10 text-[20px] mt-4 font-lumanosimo font-bold'>What we offer ?</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>1. Real-Time Code Editor and Compiler
Our platform features a state-of-the-art code editor that supports multiple programming languages. With integrated compilers, you can instantly compile and test your code, making the interview process more interactive and efficient.</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>2. Mock Interviews
Practice makes perfect. Schedule mock interviews with peers, mentors, or industry professionals to get constructive feedback and improve your performance. Our mock interview feature simulates real interview conditions, helping you to get comfortable with the process.</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>3. Real Interviews
Leverage our platform for real interviews with potential employers. Our secure and reliable environment ensures that your interviews are conducted smoothly and professionally.</p>


        <p className='ml-10 text-[20px] mt-2 font-poppins'>4. Feedback and Analytics
Receive detailed feedback and performance analytics after each interview session. Identify your strengths and areas for improvement to continuously enhance your skills.</p>


        <p className='ml-10 text-[20px] mt-4 font-lumanosimo font-bold'>Why Choose Us</p>
        <p className='ml-10 text-[20px] mt-2 font-lumanosimo font-semibold'> -&gt; Interactive Experience</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>Our integrated code editor and compiler make technical interviews more dynamic and engaging. Practice coding questions in real-time and see your results immediately.</p>

        <p className='ml-10 text-[20px] mt-2 font-lumanosimo font-semibold'> -&gt; Comprehensive Preparation</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>From mock interviews to detailed feedback, we provide all the resources you need to prepare effectively for your interviews. Our platform is designed to mimic real interview scenarios, so you're always ready.</p>

        <p className='ml-10 text-[20px] mt-2 font-lumanosimo font-semibold'> -&gt; Community and Support</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins'>Join a community of like-minded individuals who are all striving towards the same goal. Share experiences, exchange tips, and grow together. Our support team is always here to help you with any issues or questions you might have.</p>

        <p className='ml-10 text-[20px] mt-2 font-lumanosimo font-semibold'> -&gt; Join Us Today</p>
        <p className='ml-10 text-[20px] mt-2 font-poppins mb-10'>At AlgoMingle.com, we are committed to helping you achieve your career aspirations. Whether you're a student gearing up for your first job interview or an experienced candidate looking to refine your skills, our platform is here to support your journey. Sign up today and take the first step towards acing your interviews! <span className='cursor-pointer font-bold text-[#ED5B2D] underline' onClick={(e)=>{
                navigate("/");
        }}>Join Us</span></p>
    {/* <OutputDialog /> */}
    </div>
  )
}

export default About;