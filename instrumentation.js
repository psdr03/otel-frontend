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

// api token VXrgZkg5TM2St1yQaS63cg - DOES NOT WORK 401 on the endpoint
// ingest token UHia8bnSgwz8zR6IEl8mQg - WORKS
// both ish5gWj9-CxjMvrLiCd9QQ - WORKS
// opentelemetry

// https://ingest.au0.signalfx.com/v2/trace/otlp
// https://ingest.au0.signalfx.com/v2/trace/sapm
// "application/x-protobuf",
// "application/json"

// const exporter = new OTLPTraceExporter({
//   headers: {
//     "Content-Type": "application/json",
//     "X-SF-TOKEN": "ish5gWj9-CxjMvrLiCd9QQ",
//   },
// });

// const exporter = new OTLPTraceExporter();
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "sho-website",
  }),
  spanProcessor: new BatchSpanProcessor(new OTLPTraceExporter(), {
    maxQueueSize: 2048,
    maxExportBatchSize: 512,
  }),
  // spanProcessor: new SimpleSpanProcessor(exporter),
  instrumentations: [
    getNodeAutoInstrumentations({
      "@opentelemetry/instrumentation-fs": { enabled: false },
    }),
  ],
});
sdk.start();
