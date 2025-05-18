## Project Overview
This project is intended for learning purposes, demonstrating how to configure NestJs microservices that communicate over gRPC inside of a Monorepo (using Turborepo) structure

> Disclaimer: The actual application being implemented here does not warrent a microservices approach given how simple it is, the simplicity of the business logic and limited scope of each microservices are to make understanding the structure/gRPC elements easier without getting bogged down in more complex business logic.

## How to run:
1. Clone the repository
2. (optional) Open the repository in VS-code with the dev-container 
3. navigate to grpc-nest-kafa directory in your terminal
3. Run `pnpm install`
4. Run `pnpm build` 
3. Run `pnpm run dev`

You should see the application spin up and be able to inspect the loggs from each of the microservices in the turborepo output.


### Application Microservices
#### The monorepo is made up of 4 services:

| App    | Function |
| ------ | -------- |
|BFF     | Backend-For-Frontend communicates with all apps in the repo, fetching required data and shaping it into single responses to be consumed by a client (api/frontend/etc...) |
|Date    | Provides a single gRPC endpoint that provides the current date|
|Weather | Provides a single gRPC endpoint that generates a string for the current weather, based on the date provided to it from the Date App over gRPC|
|Quote   | Provides a single gRPC endpoint that generates a quote based on the weather (provided over gRPC by weather service) and specifies how old the quote is (based on the date provided from the Date Service|

#### It also has 4 packages:
| Package       | responsability |
| ------------- | -------------- |
| ts-config     | Provides ts-config files that can be shared across apps to ensure consistancy, without breaking DRY principles |
| es-lint       | Provides es lint files that can be shared across apps to ensure consistancy, without breaking DRY principles |
| common-config | Provides generic common variables/consts like port numbers, urls, keys, etc... |
| protos        | Defines and provides proto definitions for gRPC in both .ts and .proto formats |

## Overview/Explaning Project Configuration

### `es-lint` and `ts-config` sharing
In a monorepo we will likely have cases where we want to re-use the same build configuration.
In this monorepo we have 4 NestJs apps that all use es-lint and typescript.
To avoid defining 4 tsconfig.json and eslint.json files and having to maintain them, we use these packages.

How do you hook them up? Well it's nice and simple. In your NestJS app simply add the following to `devDependancies`:
```
    "@repo/eslint-config": "workspace:*",
    "@repo/typescript-config": "workspace:*",
```

`worksapce:*` tells the builder that these packages can be found in the current monorepo. How does it find them? Based on the `name` defined in the package.json of our turborepo packages. For example in eslint-config package directory you'll see the package.json name contains: `"@repo/eslint-config"` which matches up to our devDependancy package name in our app.

How do we integrate that into our apps ts-config/es-lint then? Simple, for tsconig.json add:
```
{
  "extends": "@repo/typescript-config/base.json",
  <rest of your existing config>
}
```

and for `eslint.config.mjs` add:
```
import { config } from '@repo/eslint-config/base';


export default tseslint.config(
  ...config,
  ...<rest of your existing config>
)
```

These means they will extend the base files defined in our packages, but can also override in their app config files where required. Perfecto!


### `protos` Package
gRPC communication requires proto definitions. These define the services that exist as well as the DTO that go between them (request and responses).
As gRPC communication is inherently inter-app we define these in a shared package so any app in our monorepo can gain access to all of the definitions

Now as we're working with NestJs apps we'll not only want a Proto definition but a Ts definition as well so they can be used inside of our nestjs typescript files To achieve this our package.json in the protos package looks like this:

```
  "scripts": {
    "clean": "rm -rf dist tsconfig.tsbuildinfo",
    "generate": "protoc --plugin=./node_modules/.bin/protoc-gen-ts_proto --proto_path=src/protos --ts_proto_out=src/generated --ts_proto_opt=outputServices=grpc-js,outputClientImpl=grpc-js,esModuleInterop=true,forceLong=string src/protos/*.proto",
    "build": "pnpm run clean && pnpm run generate && tsc -b",
    "typeScript": "tsc -b"
  },
```

The flow here is to use the `generate` script to convert our protos into .ts files, then when we `build` us tsc to create the definitions files and js to be sored in the dist folder

We then export both the typescript files and original proto files like so:
```
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./src/protos/*.proto": {
      "import": "./src/protos/*.proto",
      "require": "./src/protos/*.proto"
    }
  },
```
Making both proto and typescript exports available to any app depending on our package. You can then include the `protos` package in any app in the monorepo
by adding it to the app's `package.json` dependancies like so:

```
  "dependencies": {
    "@repo/protos": "workspace:*",
    < your other deps >
  }
```




### NestJS App gRPC configuration
NestJs comes packaged with a load of *SUPER* useful features for configuring a NestJs app as a microservice that integrates gRPC.

To do this first bootstrap your NestJs app as a microservice like so:

```
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'date', // should match the .protos package 
        protoPath: require.resolve('@repo/protos/src/protos/date.proto'),
        url: process.env.DATE_GRPC_URL || '0.0.0.0:50051',
      },
    },
  );
  await app.listen();
}
bootstrap();
```

Note that:
- We are defining the app with `NestFactorycreateMicroservice` instead of `NestFactory.create`
- Configuring gRPC for the app with it's name, proto path, and port number.

Defining controllers in a gRPC microservice is also slightly different to a standard HTTP based NestJS app. To do this you need to structure it like so:
```
import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { GrpcMethod } from '@nestjs/microservices';
import * as Proto from '@repo/protos';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

    @GrpcMethod('DateService', 'GetCurrentDate')
    getCurrentDate(_: Proto.date.DateRequest): Proto.date.DateResponse {
      console.log('AppController: getCurrentDate() called')
      return this.appService.getCurrentDate();
    }
}

```

### Inter App gRPC calls
So you've got multiple NestJs microservices that have gRPC controllers. How do you communicate between them?

You can do this be configuring other gRPC services in the app you want to connect them to like so:
```
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DATE_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'date',
          protoPath: require.resolve('@repo/protos/src/protos/date.proto'),
          url: process.env.DATE_SERVICE_URL || "0.0.0.0:50051", // ensure this matches the url of the target service
        },
      },
      //... add any other services you want to add
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

Once you've done this you can then call the service in your application code like this:

```
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import * as Proto from '@repo/protos';
import { firstValueFrom, Observable } from 'rxjs';

interface DateService {
  getCurrentDate(request: Proto.date.DateRequest): Observable<Proto.date.DateResponse>;
}

@Injectable()
export class AppService {
  private dateClient: DateService;

  // Note that the DATE_SERVICE must match the key defined in module above
  constructor(@Inject('DATE_SERVICE') private readonly client: ClientGrpc) {
    this.dateClient = this.client.getService<DateService>('DateService');
  }

  async getWeather(): Promise<Proto.weather.WeatherResponse> {
    const date = await firstValueFrom(this.dateClient.getCurrentDate({}));
    const options: string[] = ['sunny', 'slightly rainy', 'cloudy', 'windy'];
    const idx = (date.day % options.length);

    return { weather: options[idx]};
  }
}

```

And that's it! You can now communicate between each of your gRPC microservices!



### Turborepo scripts and builds
One of the big benefits of Turborepo is both simplifying and speeding up our build process, in monorepos where we have multiple packages and apps that have cross dependancies. So how does it work?

It's all defined in the root directories pnpm-workspace.yaml and turbo.json!

`pnpm-workspace.yaml` defines where the packages and apps we want to work on exist:
```
packages:
  - "apps/*"
  - "packages/*"

```

then turbo.json defines scripts that allow us to do things like building and spinning up all of our packages and apps with a single command
```
{
  "$schema": "https://turborepo.com/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", ".env*"],
      "outputs": [".next/**", "!.next/cache/**", "dist/**"]
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "check-types": {
      "dependsOn": ["^check-types"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}

```
This works by looking into each of the packages/apps in our monorepo and matching the task (for example "build") to a script entry in the respective apps/packages package.json. 

>Common Mistake: when creating a default NestJS app the package.json will normally have "start:dev" as the dev script. This will not work with turborepo as it's trying to matching against "dev". To fix this you can simply update the package.json script name to dev

What's particularly great about this is that Turborepo will check the dependancies in the project and efficiently order all of the build steps so that dependancies are built before apps that depend on them, and apps with no dependancies can build in parallel.

On top of this there is *FULL TURBO*. WTF is Full Turbo??? It solves an inherent problem in monorepos... they have multiple apps/packages and rebuilds all of them everytime. Yuk. Time wasting.
Turborepo solves this by caching each package/app, then if nothing has changed it uses that cache instead of re-building allowing us to massively speed up our development time!

To execute the Turbo scripts you simply run `pnpm turbo run build` or `pnpm turbo run dev`.

# WIP: Future Improvements:
- Clean up logging so it's more maintainable and informative for people using the app
- Add Kafka docker container and integrate some basic behaviour
