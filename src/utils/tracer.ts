import tracer from 'dd-trace'

tracer.init({
  logInjection: true,
  service: `forte-live-class-scheduler-${process.env.ENV}`,
})

export default tracer
