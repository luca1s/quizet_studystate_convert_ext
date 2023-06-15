function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

let html = document.body.innerHTML;
let content = QuizletFetcher(html);

let finalContent = "";
for (let i = 0; i < content["cards"].length; i++) {
    const term = content["cards"][i]["term"];
    const definition = content["cards"][i]["definition"];
    const final = i === content["cards"].length - 1 ? "" : "\n\n";
    finalContent += `${term},${definition}${final}`;
}


const button = document.createElement("button");
button.innerText = "StudyState Export";
button.className = "AssemblyButtonBase AssemblyPrimaryButton--default AssemblyButtonBase--medium AssemblyButtonBase--padding";
button.style.marginTop = "0.5em";
button.style.marginLeft = "auto";
button.style.marginRight = "auto";

button.onclick = () => {
    button.disabled = true;

    const div = document.createElement("div")
    div.style.position = "fixed"
    div.style.left = "50%";
    div.style.top = "50%";
    div.style.padding = "20px";
    div.style.backgroundColor = "#2b3c70";
    div.style.borderRadius = "15px";
    div.style.transform = "translate(-50%, -50%)";
    div.style.zIndex = "9999899999999999";
    div.style.width = "90%";

    const textarea = document.createElement("textarea");
    textarea.style = `
        -webkit-font-smoothing: antialiased;
        border-radius: .5rem;
        cursor: text;
        font-size: .875rem;
        font-weight: 600;
        -webkit-letter-spacing: normal;
        -moz-letter-spacing: normal;
        -ms-letter-spacing: normal;
        letter-spacing: normal;
        line-height: 1.4285714285714286;
        padding: 10px;
        width: 100%;
    
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #282e3e;
        border: none;
        border-radius: 0;
        box-shadow: none;
        color: #f6f7fb;
        cursor: text;
        -webkit-flex: 1 1 auto;
        -ms-flex: 1 1 auto;
        flex: 1 1 auto;
        font: inherit;
        outline: none;
    `;
    textarea.readOnly = true;
    textarea.style.height = "65vh";
    textarea.value = finalContent;

    const breakElem = document.createElement("br");

    const copyButton = document.createElement("button");
    copyButton.innerText = "Copy";
    copyButton.className = "AssemblyButtonBase AssemblyPrimaryButton--default AssemblyButtonBase--medium AssemblyButtonBase--padding";
    copyButton.style.display = "inline";
    copyButton.onclick = () => {
        navigator.clipboard.writeText(finalContent).then(
            () => {
                copyButton.disabled = true;
                copyButton.innerText = "Copied!";
            }
        );
    }

    const closeButton = document.createElement("button");
    closeButton.innerText = "Done";
    closeButton.className = "AssemblyButtonBase AssemblyPrimaryButton--default AssemblyButtonBase--medium AssemblyButtonBase--padding";
    closeButton.style.display = "inline";
    closeButton.style.marginLeft = "0.5em";
    closeButton.onclick = () => {
        div.remove();
        button.disabled = false;
    }

    div.appendChild(textarea);
    div.appendChild(breakElem);
    div.appendChild(copyButton);
    div.appendChild(closeButton);
    document.body.appendChild(div);
}

waitForElm('.SetPageHeader-headerOptions').then((elm) => {
    elm.appendChild(button);
});