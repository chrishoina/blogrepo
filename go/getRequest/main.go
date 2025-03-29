package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

// I mentioned this in the blog, but "items" and "links" will be an array of your results set. Those arrays will contain
// one or more JSON objects. They can be nested as well. A reminder, that your custom-ORDS APIs and the Auto-REST enabled APIs
// will look a little different. They WILL however all still have the same "top-level" properties, as you see in this block below.

type Response struct {
	Items   []Items `json:"items"`
	Hasmore bool    `json:"hasMore"`
	Limit   int     `json:"limit"`
	Offset  int     `json:"offset"`
	Count   int     `json:"count"`
	Links   []Links `json:"links"`
}

type Items struct {
	Genre string `json:"genre"`
}

type Links struct {
	Rel  string `json:"rel"`
	Href string `json:"href"`
}

func main() {

	response, err := http.Get("http://localhost:8081/ords/ordsdemo/mymovies/movie-genre")

	if err != nil {
		fmt.Print(err.Error())
		os.Exit(1)
	}

	responseData, err := ioutil.ReadAll(response.Body)
	if err != nil {
		log.Fatal(err)
	}

	var responseObject Response
	json.Unmarshal(responseData, &responseObject)

	// These code blocks should in no way be considered a "best practice." If you are coming from Go, then you are light years
	// ahead of me. Consider this more of a template for working with a fairly standard ORDS API. Have fun!

	for i := 0; i < len(responseObject.Items); i++ {
		fmt.Println(responseObject.Items[i].Genre)
	}

	fmt.Println(responseObject.Hasmore)
	fmt.Println(responseObject.Limit)
	fmt.Println(responseObject.Offset)
	fmt.Println(responseObject.Count)

	for i := 0; i < len(responseObject.Links); i++ {
		fmt.Println("Link for " + responseObject.Links[i].Rel + ": " + responseObject.Links[i].Href)
	}

}
