let myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

export const register = async (username, email, password)=> {
    let response
    let raw = JSON.stringify({
        "username": username,
        "email": email,
        "password": password
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetch("http://localhost:3900/api/new", requestOptions).then(response => response.text()).then(result => {
        response = JSON.parse(result)
    })
    return response
}

export const auth = async (email, password)=> {
    let response
    let raw = JSON.stringify({
        "email": email,
        "password": password
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetch("http://localhost:3900/api/auth", requestOptions).then(response => response.text()).then(result => {
        response = JSON.parse(result)
    })
    return response
}

export const updateNames = async (email, name, lastname, genre)=> {
    let response
    let raw = JSON.stringify({
        "email": email,
        "name": name,
        "lastname": lastname,
        "genre": genre
    });
    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    await fetch("http://localhost:3900/api/updateNames", requestOptions).then(response => response.text()).then(result => {
        response = JSON.parse(result)
    })
    return response
}

export const uploadImage = async (email, imageFile) => {
    let response
    let myHeaders = new Headers();

    let formdata = new FormData();
    formdata.append("image", imageFile, imageFile.name);
    formdata.append("email", email);

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    await fetch("http://localhost:3900/api/upload", requestOptions).then(response => response.text()).then(result => {
        response = JSON.parse(result)
    })
    return response
}