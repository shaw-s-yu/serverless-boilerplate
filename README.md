# serverless-boilerplate

<div id="top"></div>
<br />
<div align="center">
  <a href="https://forte.fit">
    <img src="assets/images/forte-logo.png" alt="FORTË Logo" width="300">
  </a>

  <h3 align="center">Forte Serverless Boilerplate</h3>
</div>

### Prerequirement

- (node)[https://nodejs.org/en/]
- yarn

```
npx install -g yarn
```

- install node packages

```
yarn install
```

- create `.env`, get variables corresponding service apps.

- create local database, (edit .env DATABASE_URL)

```
yarn docker
```

- whenever prisma schema changes, migrate local database

```
yarn prisma-migrate[optional :qa]
```

### Deployment

- the deployment happens on `git push` to corresponding branch according to action yml files in `.github/worksflows/`
- make sure to have secrets(defined in action yml files in `.github/worksflows/`) stored in github repo->settings->secret and variables->actions->new repository secret

### Relational Model

- prisma: https://www.prisma.io/docs/getting-started/quickstart
- edit/update model at: `./prisma/schema.prisma`
- push model into database:

```
npx prisma migrate dev --name init
```

- pull model from database:

```
npx prisma pull
```

### OpenAPI/Swagger generation

We uses [serverless swagger auto generator](https://github.com/completecoding/serverless-auto-swagger) to generate swagger config file. The swagger config file is generated based on serverless config -- `serverless.yml`

- generate swagger.json

```
yarn build
```

- view swagger
  - run locally:

```
yarn dev
```

- or current swagger uri: https://mjsa8k2lk2.execute-api.us-east-1.amazonaws.com/dev/swagger

### Serverless functions

- local invoke

```
sls invoke local -f <function name> [options]
```

- deploy

```
sls deploy
```

---

### DataDog set up

- local setup logs

  - to send logs to datadog, it requires to install datadog agent to your local machine, find instruction to install [here](https://us3.datadoghq.com/account/settings#agent/mac)
  - once installed, `datadog-agent` command is available.
  - update `datadog-agent` settings for
    - api_key
    - site
    - logs_enabled: true
  - either update settings by
    - command `datadog-agent launch-gui` and go to settings
    - edit `~/.datadog-agent/datadog.yaml`
  - set up forwarding configuration for `datadog-agent`, find instruction [here](https://us3.datadoghq.com/logs/onboarding/server) for different source

    - in case of node:

      - Create a file `nodejs.d/conf.yml` in the Agent’s conf.d/ directory with following content:

      ```
      logs:
        - type: file
          path: /path/to/your/nodejs/log.log
          service: myapplication
          source: nodejs
          sourcecategory: sourcecode
      ```

      - use `winston` to save logs to local log file, find instuction [here](https://docs.datadoghq.com/logs/log_collection/nodejs/?tab=winston30). Note: the local log file path need to match the path in the above Agent's `nodejs.d/conf.yml`

- set up traces (non local)

  - [instruction](https://docs.datadoghq.com/tracing/trace_collection/dd_libraries/nodejs?tab=awslambda)
  - Note from DataDog:

    > Import and initialize the tracer either in code or via command line arguments. The Node.js tracing library needs to be imported and initialized before any other module.

    > Once you have completed setup, if you are not receiving complete traces, including missing URL routes for web requests, or disconnected or missing spans, confirm step 2 has been correctly done. The tracing library being initialized first is necessary for the tracer to properly patch all of the required libraries for automatic instrumentation.

    > When using a transpiler such as TypeScript, Webpack, Babel, or others, import and initialize the tracer library in an external file and then import that file as a whole when building your application.

  - Import and initialize the tracer before any other module: create `tracer.ts`:

    ```
    import tracer from 'dd-trace'

    tracer.init({
      logInjection: true // if you wish to send log by trace,
      service: '<service name>',
    })

    export default tracer

    ```

  - example to send trace, include this in your function handler:

    ```
    import tracer from './tracer'
    const span = tracer.startSpan('forte-live-class-scheduler-healthcheck')
    span.setTag('healthcheck', 'OK')
    span.finish()
    ```

  - deploy the function
  - follow [instruction](https://us3.datadoghq.com/account/settings#agent/lambda) to install agent into AWS Lambda. Select the function deployed to set up the agent.
  - trigger the function a few times and check trace list in Datadog cloud.

- set up cloud logging from AWS

  - there could be other [ways](https://docs.datadoghq.com/logs/log_collection/nodejs/?tab=winston30) to do so but in this doc, we use trace to send log.
  - pre-required: the previous step to set up trace
  - [instruction](https://docs.datadoghq.com/tracing/other_telemetry/connect_logs_and_traces/nodejs/) for the following steps

    - add `logInjection: true` in `tracer.ts`
    - example to send logs by trace:

      ```
      const span = tracer.scope().active()
      const time = new Date().toISOString()
      const record = { time, level, message }

      if (span) {
        tracer.inject(span.context(), LOG, record)
      }

      // the console.log is required to send this individual log
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(record))
      ```
