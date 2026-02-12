package main

import (
	"net/http"
)

func (app *application) serveSignUpPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./ui/signup.html")
}

func (app *application) serveLoginPage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./ui/login.html")
}

func (app *application) serveActivatePage(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./ui/activate.html")
}

func (app *application) serveSPA(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./ui/app.html")
}
