const registrationButton: HTMLButtonElement = document.querySelector("#registration-button")!;
registrationButton.addEventListener("click", event => {
    event.preventDefault();
    console.log("Registration button clicked");
    // Do something
});
