package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

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

	for i := 0; i < len(responseObject.Items); i++ {
		fmt.Println(responseObject.Items[i].Genre)
	}

	fmt.Println(responseObject.Hasmore)
	fmt.Println(responseObject.Limit)
	fmt.Println(responseObject.Offset)
	fmt.Println(responseObject.Count)

	for i := 0; i < len(responseObject.Links); i++ {
		fmt.Println(responseObject.Links[i].Rel + responseObject.Links[i].Href)
	}

}
