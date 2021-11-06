import React from 'react'
import { AiOutlineFacebook, AiOutlineLinkedin, AiOutlineInstagram, AiOutlineGithub } from "react-icons/ai";

import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>

      <div className='footer-left'>
        <a className='footer-link' href="https://github.com/TsaiZinan">
          <AiOutlineGithub />
        </a>
        <a className='footer-link' href="">
          <AiOutlineLinkedin />
        </a>
        <a className='footer-link' href="">
          <AiOutlineInstagram />
        </a>
        <a className='footer-link' href="">
          <AiOutlineFacebook />
        </a>
      </div>

      <div className='footer-right'>
        @Tsai 2021
      </div>

    </div>
  )
}

export default Footer
