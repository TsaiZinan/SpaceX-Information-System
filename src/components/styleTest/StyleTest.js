import React from 'react'

import { useState } from 'react'

import { HexColorPicker } from "react-colorful";

import './StyleTest.css'


const StyleTest = () => {
  const [myBackgroundColor, setMyBackgroundColor] = useState('#f7c843')

  const [myButtonColor, setMyButtonColor] = useState('#bab7d1')
  const [myButtonFontColor, setMyButtonFontColor] = useState('#000000')

  const [myReuseNodeColor, setMyReuseNodeColor] = useState('#9acc83')
  const [myUnreuseNodeColor, setMyUnreuseNodeColor] = useState('#f5a79b')
  const [myNodeFontColor, setMyNodeFontColor] = useState('#000000')

  //not update well
  const ColorPicker = (props) => {
    return (
      <div className='color-picker-individual'>
        {props.name}
        <HexColorPicker color={props.colorVar} onChange={props.funct} />
        {props.colorVar}
      </div>
    )
  }

  const DisplayNode = (props) => {
    var colorState
    props.mode === 'reuse' ? colorState = myReuseNodeColor : colorState = myUnreuseNodeColor
    return (
      <div
        className='node'
        style={{ backgroundColor: colorState, color: myNodeFontColor }}
      >
        Number: 114 <br />
        Reused: Yes <br />
        Year: 2021 <br />
        KSC LC 39A
      </div>
    )
  }

  return (
    <div
      className='test-page'
      style={{ backgroundColor: myBackgroundColor }}
    >

      <div className='color-picker'>
        {/* <ColorPicker name='nnn' colorVar={myButtonFontColor} funct={setMyButtonFontColor}/> */}

        <div className='color-picker-component'>
          <div className='color-picker-individual'>
            Background
            <HexColorPicker color={myBackgroundColor} onChange={setMyBackgroundColor} />
            {myBackgroundColor}
          </div>
        </div>

        <div className='color-picker-component'>
          <div className='color-picker-individual'>
            Button Background
            <HexColorPicker color={myButtonColor} onChange={setMyButtonColor} />
            {myButtonColor}
          </div>

          <div className='color-picker-individual'>
            Button Font
            <HexColorPicker color={myButtonFontColor} onChange={setMyButtonFontColor} />
            {myButtonFontColor}
          </div>
        </div>

        <div className='color-picker-component'>
          <div className='color-picker-individual'>
            Node Reuse
            <HexColorPicker color={myReuseNodeColor} onChange={setMyReuseNodeColor} />
            {myReuseNodeColor}
          </div>

          <div className='color-picker-individual'>
            Node Unreuse
            <HexColorPicker color={myUnreuseNodeColor} onChange={setMyUnreuseNodeColor} />
            {myUnreuseNodeColor}
          </div>

          <div className='color-picker-individual'>
            Node Font
            <HexColorPicker color={myNodeFontColor} onChange={setMyNodeFontColor} />
            {myNodeFontColor}
          </div>
        </div>






      </div>

      <div className='component-display'>

        <div className='display-button'>
          <button
            style={{ backgroundColor: myButtonColor, color: myButtonFontColor }}
          >Button</button>

          <button
            style={{ backgroundColor: '#ffffff', color: '#9e9b9b' }}
          >Button</button>
        </div>


        <div className='display-node'>
          <DisplayNode mode='reuse' />
          <DisplayNode mode='unreuse' />
        </div>

      </div>




    </div>
  )
}

export default StyleTest
