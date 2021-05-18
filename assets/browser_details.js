$(document).ready(function() {
    let result = bowser.getParser(window.navigator.userAgent);
    console.log(result);

    $(".details").html(`
        <div>Browser: ${result.parsedResult.browser.name}</div>
        <div>Version: ${result.parsedResult.browser.version}</div>
        <div>Device type: ${result.parsedResult.platform.type}</div>
        <div>OS: ${result.parsedResult.os.name}</div>
    `);
});