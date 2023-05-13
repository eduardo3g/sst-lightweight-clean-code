import { SSTConfig } from "sst";
import { CleanSoundsStatefulStack } from "./clean-sounds/stateful/stateful"
import { CleanSoundsStateless } from "./clean-sounds/stateless/stateless"

export default {
  config(_input) {
    return {
      name: "sst-lightweight-clean-code",
      region: "us-east-1",
      profile: "default",
    }
  },
  stacks(app) {
    app.setDefaultRemovalPolicy(app.mode === "dev" ? "destroy" : "retain")
    app
      .stack(CleanSoundsStatefulStack)
      .stack(CleanSoundsStateless)
  }
} satisfies SSTConfig;
