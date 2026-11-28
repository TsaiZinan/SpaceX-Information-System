import React from 'react'
import { AiOutlineGithub } from "react-icons/ai";

import './Footer.css'

const Footer = () => {
  return (
    <footer className='footer'>

      <div className='footer-left'>
        <a className='footer-link' href="https://github.com/TsaiZinan" aria-label="TsaiZinan on GitHub">
          <AiOutlineGithub />
        </a>
      </div>

      <div className='footer-right'>
        @Tsai 2021
      </div>

    </footer>
  )
}

export default Footer
