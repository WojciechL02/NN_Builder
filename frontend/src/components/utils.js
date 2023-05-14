

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
}


function handleLogout() {
    const requestOptions = {
        method: "POST",
        headers: {
            'X-CSRFToken': getCookie("csrftoken"),
        },
    }
    fetch("/api/logout", requestOptions)
    .then(() => {
        navigate("/");
    });
}
