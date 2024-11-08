import React, { useContext } from 'react'
import { SectionContext } from '../contexts/SectionProvider'

const useSection = () => {
  return useContext(SectionContext)
}

export default useSection