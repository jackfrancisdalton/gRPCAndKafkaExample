

# TODO:
- clean up env variables binding in each app
- generate the Readme content
- clean up logging so it's more maintainable and informative for people using the app
- Add Kafka docker container and integrate some basic behaviour

# Draft read me content

## Project Overview
### Turbo repo
- monorepo 
- turbo cache
- detail key files
- explain how turbo scripts link up to packages and useful commands like filter

### Packages
- common config for shared variables
- tsconfig and eslint config
- protos (proto definitions and ts compile for use in nestjs apps)

### Apps
general summary of the behaviour + include a chart
- bff
- date
- weather
- quote of the day

## gRPC
- communicate using protos, use types in nestjs
- configure in main.ts and app.module.ts
