# Mastercard Recharge On-the-Go
A backend server implementation to demonstrate the capabilities of the MasterCard Location Services APIs.
This project is a companion to the [Recharge On-the-Go](https://developer.mastercard.com/solution/recharge-on-the-go) that demonstrates how [Fitbit Ionic](https://www.fitbit.com/ionic) users can find local businesses who accept contactless payment.

This project leverages the [Spring Boot Framework](https://spring.io/). See below for installation and usage details.

## References

- [Spring Boot Framework](https://spring.io/)
- [Fitbit Developer](https://dev.fitbit.com/) 

## Requirements
- Maven >=3.5 (unless using Docker)
- Java >= 8 (unless using Docker)
- Docker (optional)

## Installation and Usage

#### Manual build

##### Build the project
```
mvn clean package
``` 

##### Running the project  

The following environment variables need to be set for the project to run and function
properly:


| variable                    | description                                           |
| --------------------------- |-------------------------------------------------------|
| `api_key_path`              | File path to your MasterCard API `p12` key             |
| `api_key_alias`             | Key alias to be used                                   |
| `api_key_id`                | Consumer key associated with your MasterCard `p12` key |
| `api_key_password`          | Password of the `p12` key|
| `proxy_key`                 | Static key used to authenticate external requests (We highly recommend **NOT** using this approach in production)|
|`api_google_maps_key`        | [Google Maps API](https://developers.google.com/maps/) Key: The project leverages Google's `Directions` API to capture navigation route paths (used to draw the route on the static map)|
|`api_google_staticmaps_key`. | [Google Static Maps API](https://developers.google.com/maps/documentation/static-maps/) key: The project leverages the Google Static Maps API to visualize the start-to-end route path on a map|

Execute/run the prject manually

```
mvn spring-boot:run 
```

Using Docker

```
docker-compose up
```
