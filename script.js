const setTodaysDate = () => {
    const dateDiv = document.getElementsByClassName("todays-date")[0];

    const monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let todaysDate = new Date();
    dateDiv.innerHTML = todaysDate.getDate() + " " + monthArray[todaysDate.getMonth()] + ", " + todaysDate.getFullYear();
}

setTodaysDate();

let fetchBtn = document.getElementsByClassName("fetch-btn")[0];
let dynamicContentArea = document.getElementById("dynamic-content-area");
let mainContainer = document.getElementById("conatiner");

const loader = '<div id="loader-container"><svg viewBox="25 25 50 50"><circle r="20" cy="50" cx="50"></circle></svg></div>';
const errorMessage = '<div id="error-message-container">Some error occured. Please try again.</div>';

const showDynamicContentArea = () => {
    dynamicContentArea.style.visibility = "visible";
    dynamicContentArea.innerHTML = loader;
}

const capitalizeString = (theStr) => {
    const capitalizedStr = theStr.charAt(0).toUpperCase() + theStr.slice(1).toLowerCase();
    return capitalizedStr;
}

function generateRandomNumber(max) {
    return Math.floor(Math.random() * (max - 1 + 1)) + 1;
}

const fetchPosts = () => {
    const getRandomNumber = generateRandomNumber(100);
    return fetch('https://jsonplaceholder.typicode.com/posts/' + getRandomNumber)
    .then(response => response.json())
}

const fetchUsers = () => {
    const getRandomNumber = generateRandomNumber(10);
    return fetch('https://jsonplaceholder.typicode.com/users/' + getRandomNumber)
    .then(response => response.json())
}

const fetchComments = () => {
    return fetch('https://jsonplaceholder.typicode.com/comments')
    .then(response => response.json())
}

const enableOrDisableComments = (objRef) => {
    let refText = objRef.innerHTML;
    let commentsDiv = document.getElementById("post-comments-div");

    if (refText == "Show Comments") {
        commentsDiv.style.display = "block";
        objRef.innerHTML = "Hide Comments";
    } else {
        commentsDiv.style.display = "none";
        objRef.innerHTML = "Show Comments";
    }
}

fetchBtn.addEventListener("click", () => {
    const fetchAllData = [fetchPosts(), fetchUsers(), fetchComments()];
    console.log("Fetching");

    showDynamicContentArea();
    
    Promise.all(fetchAllData)
    .then(results => {
        let post = results[0];
        let user = results[1];
        let comments = results[2];

        console.log('Posts:', post);
        console.log('Users:', user);
        console.log('Comments:', comments);

        let content = '<div id="content-area"><div id="post-heading">';

        content += capitalizeString(post.title) + '</div><div id="post-content">' + capitalizeString(post.body) + '</div>';

        let email = user.email;
        content += '<div id="post-by-line">Writer: ' + user.name + '<br>Email: <a href="mailto:' + email + '">' + email + '</a></div>';
        content += '<div id="post-comments-div"><div class="comments-heading">Comments</div>';

        let getRandomNumber = generateRandomNumber(200);

        for (let i = getRandomNumber; i < getRandomNumber + 10; i++) {
            content += '<div class="individual-comment-box"><div class="post-comment">' + comments[i].body + '</div><div class="post-by-line">' + comments[i].email + "</div></div><hr>";
        }

        content += '</div><div id="comments-enabler-div" onclick="enableOrDisableComments(this);">Show Comments</div>';

        dynamicContentArea.innerHTML = content;

    })
    .catch(error => {
        // console.error("Error:", error);
        dynamicContentArea.innerHTML = errorMessage;
    });
});