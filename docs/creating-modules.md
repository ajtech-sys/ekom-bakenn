# Creating Custom Modules and Features in Medusa

## Overview
- Define a data model and service in `src/modules/<name>/`
- Export the module with a constant token and register it in `medusa-config.ts`
- Generate and run migrations
- Define links in `src/links/` to associate records across modules
- Create workflows in `src/workflows/` to orchestrate logic
- Expose functionality via `src/api/` routes
- Customize Admin with widgets and routes in `src/admin/`

## Steps

### 1) Module: Model
Create `src/modules/<name>/models/<entity>.ts`:
```ts
import { model } from "@medusajs/framework/utils"

const Entity = model.define("<entity>", {
  id: model.id().primaryKey(),
  name: model.text(),
})

export default Entity
```

### 2) Module: Service
Create `src/modules/<name>/service.ts`:
```ts
import { MedusaService } from "@medusajs/framework/utils"
import Entity from "./models/<entity>"

class <PascalName>ModuleService extends MedusaService({
  Entity,
}) {}

export default <PascalName>ModuleService
```

### 3) Module: Definition
Create `src/modules/<name>/index.ts`:
```ts
import <PascalName>ModuleService from "./service"
import { Module } from "@medusajs/framework/utils"

export const <UPPER_NAME>_MODULE = "<name>"

export default Module(<UPPER_NAME>_MODULE, {
  service: <PascalName>ModuleService,
})
```

### 4) Register Module & Migrate
In `medusa-config.ts` add:
```ts
modules: [
  { resolve: "./src/modules/<name>" },
]
```
Generate and migrate:
```
npx medusa db:generate <name>
npx medusa db:migrate
```

### 5) Define Module Links
Create `src/links/<left>-<right>.ts`:
```ts
import LeftModule from "../modules/<left>"
import RightModule from "@medusajs/medusa/<right>"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  { linkable: RightModule.linkable.<right_entity>, isList: true },
  LeftModule.linkable.<left_entity>
)
```
Sync links:
```
npx medusa db:migrate
```

### 6) Workflows
Create `src/workflows/<feature>/<name>.ts` with steps using container-resolved services and return `WorkflowResponse`.

### 7) API Routes
Implement REST handlers under `src/api/admin/...` and `src/api/store/...` using `MedusaRequest` and `MedusaResponse`.

### 8) Admin Customization
- Widget: `src/admin/widgets/<widget>.tsx` using `defineWidgetConfig`
- Route: `src/admin/routes/<path>/index.tsx` using `defineRouteConfig`

## Tips
- Use the module token to resolve services from `req.scope` or workflow container
- Prefer workflows for multi-step operations and linking
- Keep modules isolated; use links to relate cross-module data