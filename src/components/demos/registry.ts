import { defineAsyncComponent, type Component } from 'vue'
import DemoLoadError from './DemoLoadError.vue'
import DemoLoading from './DemoLoading.vue'

function defineDemo(loader: () => Promise<{ default: Component }>) {
  return defineAsyncComponent({
    loader,
    loadingComponent: DemoLoading,
    errorComponent: DemoLoadError,
    delay: 200,
    timeout: 10000,
  })
}

export const demoRegistry: Record<string, Component> = {
  ScalingDiagram: defineDemo(() => import('../diagrams/ScalingDiagram.vue')),
  ClientServerLBDiagram: defineDemo(() => import('../diagrams/ClientServerLBDiagram.vue')),
  LoadBalancerDemo: defineDemo(() => import('./LoadBalancerDemo.vue')),
  StickySessionDiagram: defineDemo(() => import('../diagrams/StickySessionDiagram.vue')),
  ComparisonDiagram: defineDemo(() => import('../diagrams/ComparisonDiagram.vue')),
  StepThroughDiagram: defineDemo(() => import('../diagrams/StepThroughDiagram.vue')),
  JourneyDiagram: defineDemo(() => import('../diagrams/JourneyDiagram.vue')),
  CacheDemo: defineDemo(() => import('./CacheDemo.vue')),
  CapTheoremDiagram: defineDemo(() => import('./CapTheoremDiagram.vue')),
  QueueDemo: defineDemo(() => import('./QueueDemo.vue')),
  RateLimiterDemo: defineDemo(() => import('./RateLimiterDemo.vue')),
  CircuitBreakerDemo: defineDemo(() => import('./CircuitBreakerDemo.vue')),
  CapacityCalculator: defineDemo(() => import('./CapacityCalculator.vue')),
  CacheLayersDemo: defineDemo(() => import('./CacheLayersDemo.vue')),
  EventualConsistencyDemo: defineDemo(() => import('./EventualConsistencyDemo.vue')),
  PubSubFanoutDemo: defineDemo(() => import('./PubSubFanoutDemo.vue')),
  ExponentialBackoffDemo: defineDemo(() => import('./ExponentialBackoffDemo.vue')),
  TraceWaterfallDemo: defineDemo(() => import('./TraceWaterfallDemo.vue')),
  ShardRouterDemo: defineDemo(() => import('./ShardRouterDemo.vue')),
  CanaryRolloutDemo: defineDemo(() => import('./CanaryRolloutDemo.vue')),
  SagaCompensationDemo: defineDemo(() => import('./SagaCompensationDemo.vue')),
  LeaderElectionDemo: defineDemo(() => import('./LeaderElectionDemo.vue')),
  RealtimeLatencyRaceDemo: defineDemo(() => import('./RealtimeLatencyRaceDemo.vue')),
  LatencyBarChartDemo: defineDemo(() => import('./LatencyBarChartDemo.vue')),
  CausalLoopDiagram: defineDemo(() => import('../diagrams/CausalLoopDiagram.vue')),
  StockFlowDiagram: defineDemo(() => import('../diagrams/StockFlowDiagram.vue')),
  StockFlowSimulator: defineDemo(() => import('./StockFlowSimulator.vue')),
  FeedbackLoopSimulator: defineDemo(() => import('./FeedbackLoopSimulator.vue')),
  GitOpsReconcileDemo: defineDemo(() => import('./GitOpsReconcileDemo.vue')),
  ChaosBlastRadiusDemo: defineDemo(() => import('./ChaosBlastRadiusDemo.vue')),
  SamplingRaceDemo: defineDemo(() => import('./SamplingRaceDemo.vue')),
}
