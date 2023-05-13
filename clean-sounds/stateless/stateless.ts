import { StackContext, Api as RESTApi, use } from "sst/constructs"
import { CleanSoundsStatefulStack } from "../stateful/stateful"

export function CleanSoundsStateless({ stack, app }: StackContext) {
  const { customersTable, customersEventBus } = use(CleanSoundsStatefulStack);

  const lambdaPowerToolsConfig = {
    LOG_LEVEL: 'INFO',
    POWERTOOLS_LOGGER_LOG_EVENT: 'true',
    POWERTOOLS_LOGGER_SAMPLE_RATE: '1',
    POWERTOOLS_TRACE_ENABLED: 'enabled',
    POWERTOOLS_TRACER_CAPTURE_HTTPS_REQUESTS: 'captureHTTPsRequests',
    POWERTOOLS_SERVICE_NAME: 'CustomerService',
    POWERTOOLS_TRACER_CAPTURE_RESPONSE: 'captureResult',
    POWERTOOLS_METRICS_NAMESPACE: 'CleanSounds',
  }

  const { name: appName, stage } = app

  const api = new RESTApi(stack, "AccountsApi", {
    defaults: {
      function: {
        environment: {
          ...lambdaPowerToolsConfig
        }
      }
    },
    routes: {
      "POST /accounts": {
        function: {
          handler: "clean-sounds/stateless/src/adapters/primary/create-customer-account/create-customer-account.adapter.handler",
          tracing: "active",
          functionName: `${appName}-${stage}-create-customer-account`,
          description: 'Creates a user account',
          environment: {
            TABLE_NAME: customersTable.tableName,
            EVENT_BUS: customersEventBus.eventBusName
          },
          bind: [
            customersTable,
            customersEventBus
          ]
        }
      },
      "POST /playlists/{playlistId}": {
        function: {
          handler: "clean-sounds/stateless/src/adapters/primary/add-song-to-playlist/add-song-to-playlist.adapter.handler",
          tracing: "active",
          functionName: `${appName}-${stage}-add-song-to-playlist`,
          description: 'Adds a song to an existing playlist',
          environment: {
            ...lambdaPowerToolsConfig
          }
        }
      },
    }
  })

  stack.addOutputs({
    RestApiUrl: api.url
  });
}