import { StackContext, Table, EventBus } from "sst/constructs"
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs"

export function CleanSoundsStatefulStack({ stack }: StackContext) {
  const customersTable = new Table(stack, "customersTable", {
    fields: {
      id: "string",
    },
    primaryIndex: {
      partitionKey: "id",
    },
  })

  const logGroup = new LogGroup(stack, "Log", {
    logGroupName: "/clean-sounds-events-log-group",
    retention: RetentionDays.ONE_DAY
  })

  const customersEventBus = new EventBus(stack, "customersEventBus", {
    rules: {
      logAllEventsToCloudwatch: {
        pattern: {
          source: [{ prefix: '' }] as any[] // match all events
        },
        targets: {
          cleanSoundsEventLogs: {
            type: "log_group",
            cdk: {
              logGroup: LogGroup.fromLogGroupName(stack, "cleanSoundsEventLogs", logGroup.logGroupName)
            }
          }
        },
        cdk: {
          rule: {
            description: "Log all order events"
          }
        }
      }
    }
  })

  stack.addOutputs({
    CustomersTableName: customersTable.tableName,
    customersTableArn: customersTable.tableArn,
    CustomersEventBusName: customersEventBus.eventBusName,
    CustomersEventBusArn: customersEventBus.eventBusArn
  });

  return {
    customersTable,
    customersEventBus
  }
}
