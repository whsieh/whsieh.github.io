function getSource() {
    return `
        (function() {
            console.log("This is a test!");
            fetch("https://whsieh.github.io/examples/lorem").then(response => {
                console.log("Request to " + response.url + " returned: " + response.status);
            });
            return 42;
        })()`;
}