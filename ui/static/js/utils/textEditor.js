export function handleTextWrap(input) {
    const text = input.value;
    const words = text.split(' ');
    const inputWidth = input.offsetWidth;

    let fittingText = '';
    let overflowText = '';

    for (let i = 0; i < words.length; i++) {
        const testText = words.slice(0, i + 1).join(' ');

        if (getTextWidth(testText, input) <= inputWidth) {
            fittingText = testText;
        } else {
            overflowText = words.slice(i).join(' ');
            break;
        }
    }

    input.value = fittingText;

    const allInputs = Array.from(document.querySelectorAll('.lyric-input'));
    const currentIndex = allInputs.indexOf(input);
    const linesBelow = allInputs.slice(currentIndex + 1).map(inp => inp.value)

    linesBelow.unshift(overflowText);

    allInputs.slice(currentIndex + 1).forEach((inp, i) => {
        inp.value = linesBelow[i] || '';
    });

    allInputs[currentIndex + 1]?.focus();
}

export function getTextWidth(text, element) {
    const span = document.createElement('span');
    span.style.font = window.getComputedStyle(element).font;
    span.style.visibility = 'hidden';
    span.style.position = 'absolute';
    span.textContent = text;
    document.body.appendChild(span);
    const width = span.offsetWidth;
    document.body.removeChild(span);
    return width;
}