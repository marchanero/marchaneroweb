---
name: Test Failure Report
about: Automated issue for test failures.
title: 'Test Failure on branch: ${BRANCH_NAME}'
labels: bug, automated-issue, needs-attention
assignees: ''
---

### 🚨 Test Failure Notification 🚨

Tests failed on branch **${BRANCH_NAME}**.

- **Test Command Executed**: `${TEST_COMMAND}`
- **Workflow Run**: [View Workflow Log](${WORKFLOW_RUN_URL})

Please investigate the failures and address them.
