function setLocation(cid) {
    $.getJSON(`https://ipgeolocation.abstractapi.com/v1/?api_key=${config.API_TOKEN}`, function (data) {
        $(".location").html(`
                <div>Country: ${data.country}</div>
                <div>State: ${data.region}</div>
                <div>City: ${data.city}</div>
                <div>IP address: ${data.ip_address}</div>
            `);
        var locationData = {
            country: data.country,
            state: data.region,
            city: data.city,
            ip: data.ip_address,
        };
        $.ajax({
            url: `/set-location/${cid}`,
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify(locationData),
            success: function (message) {
                console.log(message.success);
            },
        });
    });
}

$(document).ready(function () {
    if (checkCookie()) {
        alert("Cookie exists");
        let cid = fetchCookieId();
        setLocation(cid);
        getBrowserInfo(cid);
    } else {
        let cid = generateCookieId();
        setCookie(cid);
        $.ajax({
            url: "/create-cookie",
            type: "POST",
            contentType: "application/json",
            dataType: "json",
            data: JSON.stringify({ cid: cid }),
            success: function (message) {
                console.log(message.success);
            },
        });
        setLocation(cid);
        getBrowserInfo(cid);
        alert("Cookie created");
    }
});

function generateCookieId() {
    return Math.random().toString(36).substr(2) + Date.now();
}

function setCookie(cid) {
    let d = new Date();
    d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
    document.cookie =
        "name=analyticsDemo;expires=" + d.toUTCString() + ";path=/";
    document.cookie = "cid=" + cid + ";expires=" + d.toUTCString() + ";path=/";
}

function checkCookie() {
    let checkVal = "name=analyticsDemo";
    let decodedCookie = decodeURIComponent(document.cookie);
    for (let i = 0; i < decodedCookie.split(";").length; i++) {
        if (checkVal === decodedCookie.split(";")[i].trim()) {
            return true;
        }
    }
    return false;
}

function fetchCookieId() {
    let decodedCookie = decodeURIComponent(document.cookie);
    for (let i = 0; i < decodedCookie.split(";").length; i++) {
        if (decodedCookie.split(";")[i].trim().startsWith("cid=")) {
            return decodedCookie.split(";")[i].trim().substr(4);
        }
    }
}

function getBrowserInfo(cid) {
    let result = bowser.getParser(window.navigator.userAgent);

    let browserDetails = {
        name: result.parsedResult.browser.name,
        version: result.parsedResult.browser.version,
        deviceType: result.parsedResult.platform.type,
        os: result.parsedResult.os.name,
        screenSize: screen.width + "x" + screen.height,
    };

    $.ajax({
        url: `/set-device-details/${cid}`,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(browserDetails),
        success: function (message) {
            console.log(message.success);
        },
    });

    $(".device").html(`
        <div>Browser: ${result.parsedResult.browser.name}</div>
        <div>Version: ${result.parsedResult.browser.version}</div>
        <div class="text-capitalize">Device type: ${result.parsedResult.platform.type}</div>
        <div>OS: ${result.parsedResult.os.name}</div>
        <div>Screen size: ${screen.width}x${screen.height}</div>
    `);
}

$("#submit").click(function () {
    let cid = fetchCookieId();
    let userDetails = {
        name: $("#inputName").val(),
        answer: $('input[name="answer"]:checked').val(),
    };

    $.ajax({
        url: `/add-info/${cid}`,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify(userDetails),
        success: function (message) {
            console.log(message.success);
        },
    });
});
