@echo off
cd src\models

ren user.model.ts User.model.ts.tmp
ren User.model.ts.tmp User.model.ts

ren strategy.model.ts Strategy.model.ts.tmp
ren Strategy.model.ts.tmp Strategy.model.ts

ren order.model.ts Order.model.ts.tmp
ren Order.model.ts.tmp Order.model.ts

ren trade.model.ts Trade.model.ts.tmp
ren Trade.model.ts.tmp Trade.model.ts

ren position.model.ts Position.model.ts.tmp
ren Position.model.ts.tmp Position.model.ts

ren commission.model.ts Commission.model.ts.tmp
ren Commission.model.ts.tmp Commission.model.ts

ren commission-rule.model.ts Commission-rule.model.ts.tmp
ren Commission-rule.model.ts.tmp Commission-rule.model.ts

ren commission-withdrawal.model.ts Commission-withdrawal.model.ts.tmp
ren Commission-withdrawal.model.ts.tmp Commission-withdrawal.model.ts

ren commission-record.model.ts Commission-record.model.ts.tmp
ren Commission-record.model.ts.tmp Commission-record.model.ts

ren withdrawal.model.ts Withdrawal.model.ts.tmp
ren Withdrawal.model.ts.tmp Withdrawal.model.ts

ren deposit.model.ts Deposit.model.ts.tmp
ren Deposit.model.ts.tmp Deposit.model.ts

ren deposit-notification.model.ts Deposit-notification.model.ts.tmp
ren Deposit-notification.model.ts.tmp Deposit-notification.model.ts

ren health.model.ts Health.model.ts.tmp
ren Health.model.ts.tmp Health.model.ts

ren network-status.model.ts Network-status.model.ts.tmp
ren Network-status.model.ts.tmp Network-status.model.ts

ren notification.model.ts Notification.model.ts.tmp
ren Notification.model.ts.tmp Notification.model.ts

ren performance.model.ts Performance.model.ts.tmp
ren Performance.model.ts.tmp Performance.model.ts

ren platform-earning.model.ts Platform-earning.model.ts.tmp
ren Platform-earning.model.ts.tmp Platform-earning.model.ts

ren risk-event.model.ts Risk-event.model.ts.tmp
ren Risk-event.model.ts.tmp Risk-event.model.ts

ren settings.model.ts Settings.model.ts.tmp
ren Settings.model.ts.tmp Settings.model.ts

ren strategy-performance.model.ts Strategy-performance.model.ts.tmp
ren Strategy-performance.model.ts.tmp Strategy-performance.model.ts

ren strategy-rating.model.ts Strategy-rating.model.ts.tmp
ren Strategy-rating.model.ts.tmp Strategy-rating.model.ts

ren strategy-review.model.ts Strategy-review.model.ts.tmp
ren Strategy-review.model.ts.tmp Strategy-review.model.ts

ren transaction.model.ts Transaction.model.ts.tmp
ren Transaction.model.ts.tmp Transaction.model.ts

ren user-earning.model.ts User-earning.model.ts.tmp
ren User-earning.model.ts.tmp User-earning.model.ts

ren user-level.model.ts User-level.model.ts.tmp
ren User-level.model.ts.tmp User-level.model.ts

cd ..\.. 