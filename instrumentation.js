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
// const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-node");

// api token VXrgZkg5TM2St1yQaS63cg
// ingest token UHia8bnSgwz8zR6IEl8mQg
// both ish5gWj9-CxjMvrLiCd9QQ
// opentelemetry
const exporter = new OTLPTraceExporter({
  url: "https://ingest.au0.signalfx.com/v2/trace/otlp",
  headers: {
    "Content-Type": "application/x-protobuf",
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
  spanProcessor: new SimpleSpanProcessor(exporter),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": { enabled: false },
    }),
  ],
});
sdk.start();
