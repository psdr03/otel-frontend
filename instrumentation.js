const { NodeSDK } = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const {
  OTLPTraceExporter,
} = require("@opentelemetry/exporter-trace-otlp-http");
const { Resource } = require("@opentelemetry/resources");
const {
  SemanticResourceAttributes,
} = require("@opentelemetry/semantic-conventions");
const { BatchSpanProcessor } = require("@opentelemetry/sdk-trace-base");

// api token VXrgZkg5TM2St1yQaS63cg
// ingest token UHia8bnSgwz8zR6IEl8mQg
// both ish5gWj9-CxjMvrLiCd9QQ
// opentelemetry
const exporter = new OTLPTraceExporter({
  url: "https://ingest.au0.signalfx.com/v2/trace/otlp",
  headers: {
    "X-SF-TOKEN": "ish5gWj9-CxjMvrLiCd9QQ",
  },
});
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "sho-website",
  }),
  spanProcessor: new BatchSpanProcessor(exporter, {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": { enabled: false },
    }),
  ],
});
sdk.start();

process.on("SIGTERM", () => {
  sdk
    .shutdown()
    .then(() => console.log("Opentelemetry terminated"))
    .catch((error) => console.log("Error terminating tracing", error))
    .finally(() => process.exit(0));
});
