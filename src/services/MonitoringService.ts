this.alertService.sendAlert(JSON.stringify({
  ruleId: rule.id,
  metric: metric.name,
  value: metric.value,
  threshold: rule.threshold,
  severity: rule.severity,
  description: rule.description,
  timestamp: Date.now()
})); 