REFERENCE: https://opentelemetry.io/docs/languages/js/exporters/

const { resourceFromAttributes } = require('@opentelemetry/resources');
const { ATTR_SERVICE_NAME } = require('@opentelemetry/semantic-conventions');

const { NodeSDK } = require('@opentelemetry/sdk-node');

const {
    getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');

const {
    OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-http');

const {
    OTLPMetricExporter,
} = require('@opentelemetry/exporter-metrics-otlp-http');

const {
    PeriodicExportingMetricReader,
} = require('@opentelemetry/sdk-metrics');



//Instrumentations
const { ExpressInstrumentation } =
    require("opentelemetry-instrumentation-express");
const { MongoDBInstrumentation } =
    require("@opentelemetry/instrumentation-mongodb");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");


const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [ATTR_SERVICE_NAME]: "todo-service"
    }),
    traceExporter: new OTLPTraceExporter({
        url: 'http://localhost:4318/v1/traces',
    }),
    metricReader: new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter({
            url: 'http://localhost:4318/v1/metrics',
        }),
    }),
    instrumentations: [
        getNodeAutoInstrumentations(),
        new ExpressInstrumentation(),
        new MongoDBInstrumentation(),
        new HttpInstrumentation()],
});


sdk.start();
