import { defineAsyncComponent, type Component } from 'vue'
import DemoLoadError from './DemoLoadError.vue'

export const demoRegistry: Record<string, Component> = {
  ScalingDiagram: defineAsyncComponent({
    loader: () => import('../diagrams/ScalingDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  ClientServerLBDiagram: defineAsyncComponent({
    loader: () => import('../diagrams/ClientServerLBDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  LoadBalancerDemo: defineAsyncComponent({
    loader: () => import('./LoadBalancerDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  StickySessionDiagram: defineAsyncComponent({
    loader: () => import('../diagrams/StickySessionDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  ComparisonDiagram: defineAsyncComponent({
    loader: () => import('../diagrams/ComparisonDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  StepThroughDiagram: defineAsyncComponent({
    loader: () => import('../diagrams/StepThroughDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  CacheDemo: defineAsyncComponent({
    loader: () => import('./CacheDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  CapTheoremDiagram: defineAsyncComponent({
    loader: () => import('./CapTheoremDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  QueueDemo: defineAsyncComponent({
    loader: () => import('./QueueDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  RateLimiterDemo: defineAsyncComponent({
    loader: () => import('./RateLimiterDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  CircuitBreakerDemo: defineAsyncComponent({
    loader: () => import('./CircuitBreakerDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  CapacityCalculator: defineAsyncComponent({
    loader: () => import('./CapacityCalculator.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  CacheLayersDemo: defineAsyncComponent({
    loader: () => import('./CacheLayersDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  EventualConsistencyDemo: defineAsyncComponent({
    loader: () => import('./EventualConsistencyDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  PubSubFanoutDemo: defineAsyncComponent({
    loader: () => import('./PubSubFanoutDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  ExponentialBackoffDemo: defineAsyncComponent({
    loader: () => import('./ExponentialBackoffDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  TraceWaterfallDemo: defineAsyncComponent({
    loader: () => import('./TraceWaterfallDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  ShardRouterDemo: defineAsyncComponent({
    loader: () => import('./ShardRouterDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  CanaryRolloutDemo: defineAsyncComponent({
    loader: () => import('./CanaryRolloutDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  SagaCompensationDemo: defineAsyncComponent({
    loader: () => import('./SagaCompensationDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  LeaderElectionDemo: defineAsyncComponent({
    loader: () => import('./LeaderElectionDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  RealtimeLatencyRaceDemo: defineAsyncComponent({
    loader: () => import('./RealtimeLatencyRaceDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  LatencyBarChartDemo: defineAsyncComponent({
    loader: () => import('./LatencyBarChartDemo.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  CausalLoopDiagram: defineAsyncComponent({
    loader: () => import('../diagrams/CausalLoopDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  StockFlowDiagram: defineAsyncComponent({
    loader: () => import('../diagrams/StockFlowDiagram.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  StockFlowSimulator: defineAsyncComponent({
    loader: () => import('./StockFlowSimulator.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
  FeedbackLoopSimulator: defineAsyncComponent({
    loader: () => import('./FeedbackLoopSimulator.vue'),
    errorComponent: DemoLoadError,
    delay: 200,
  }),
}
