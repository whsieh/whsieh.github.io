function getSource() {
    return `
        (function() {
            console.log("This is a test!");
            fetch("https://whsieh.github.io/examples/lorem").then(response => {
                let paragraph = document.createElement("p");
                paragraph.textContent = "Request to " + response.url + " returned: " + response.status;
                document.body.appendChild(paragraph);
            });
            return 42;
        })()`;
}