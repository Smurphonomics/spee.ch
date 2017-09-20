function sendSignupRequest (channelName, password) {
    return new Promise(function(resolve, reject) {
        // make sure the claim name is still available
        let xhttp;
        const params = `username=${channelName}&password=${password}`;
        console.log(params);
        xhttp = new XMLHttpRequest();
        xhttp.open('POST', '/api/signup', true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhttp.responseType = 'json';
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 ) {
                if ( this.status == 200) {
                    if (this.response == true) {
                        resolve();
                    } else {
                        reject( new NameError("Your request could not be completed"));
                    }
                } else {
                    reject("createChannel request failed with status:" + this.status);
                };
            }
        };
        xhttp.send(params);
    });
}