

const generatePiano = () => {
    const cWidth = document.body.clientWidth
    const cHeight = document.body.clientHeight

    for (let i = 0; i < 52; i++) {
        const key = document.createElement('img')
        key.classList += "key"
        key.src = 'public/styles/white-key.svg'

        key.style = `height: ${(cHeight / 8.3) / cHeight * 100}vw;
        left:${(((cWidth / 52) * i) / cWidth * 100) + 0.1}vw;
        width: ${(cWidth / 52) / cWidth * 100}vw;`

        key.id = i + 1
        pianoDiv.appendChild(key)
    }
    
    let threeKeys = true
    let numKeys = 2
    let keyCount = 1
    for (let i = 1; i < 52; i++) {
        if (threeKeys && numKeys == 3 || !threeKeys && numKeys == 4) {
            numKeys = 1
            threeKeys = !threeKeys
        }
        else {
            const key = document.createElement('img')
            key.classList += "key"
            key.src = 'public/styles/black-key.svg'

            key.style = `height: ${(cHeight / 12.5) / cHeight * 100}vw;
            bottom: ${(cHeight / 25) / cHeight * 100}vw;
            left:${(((cWidth / 52) * i)/ cWidth * 100) - 0.5}vw;
            width: ${(cWidth / 100) / cWidth * 100}vw;
            z-index: 100;`

            key.id = keyCount + 'b'
            pianoDiv.appendChild(key)

            keyCount++
            numKeys++
        }
    }
}

const playKey = (position, noteNumber, noteOn, noteName) => {
    console.log('HEHEHEHHE')
    const toPlay = document.getElementById(position.position + (position.color ? '' : 'b'))

    toPlay.style.filter = position.color
        ? 'brightness(0) saturate(100%) invert(81%) sepia(87%) saturate(355%) hue-rotate(56deg) brightness(87%) contrast(93%)'
        : 'brightness(0) saturate(100%) invert(20%) sepia(60%) saturate(2894%) hue-rotate(120deg) brightness(92%) contrast(94%)'

    console.log('Painted note' + toPlay.id)
}