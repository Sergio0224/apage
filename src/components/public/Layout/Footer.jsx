import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebook, faLinkedin, faXTwitter, faYoutube } from '@fortawesome/free-brands-svg-icons'
import { faCopyright } from '@fortawesome/free-regular-svg-icons'

const Footer = () => {
    return (
        <footer className='flex justify-center p-4 w-full'>
            <div className='w-11/12'>
                <hr className='w-full border-bunker-950' />
                <div className='flex gap-2 sm:gap-0 sm:justify-between p-2 flex-col sm:flex-row'>
                    <p className='font-bold'><FontAwesomeIcon icon={faCopyright} /> 2024 ColabGebra. all right reserved</p>
                    <div className='gap-4 flex'>
                        <FontAwesomeIcon icon={faFacebook} />
                        <FontAwesomeIcon icon={faXTwitter} />
                        <FontAwesomeIcon icon={faYoutube} />
                        <FontAwesomeIcon icon={faLinkedin} />
                    </div>
                </div>

            </div>
        </footer>
    )
}

export default Footer