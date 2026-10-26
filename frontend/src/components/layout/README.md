# Layout Kit Usage

Velora Analytics uses a layout kit for simplifying page creation and for maintaining a consistent page design. This document highlights an outline for working with the layout kit.

## How it Works

All pages should first start with a `PageLayout` component:

```jsx
<PageLayout>
  ...
</PageLayout>
```

From there, the page can be customized with several middle level components and then further customized with some low level components.

Middle level components:

- [`PageSidebar`](#pagesidebar) - a left-hand sidebar to the page
- [`PageHeader`](#pageheader) - a title component
- [`RowLayout`](#rowlayout) - a container for a single row
- [`StatStrip`](#statstrip) - a bordered strip of summary numbers
- [`Callout`](#callout) - a tinted strip for raising items that need attention
- [`TileGrid`](#tilegrid) - a responsive grid of tiles

Low level components:

- [`RowSection`](#rowsection) - must be used inside a `RowLayout` or a `RowStack`
- [`RowStack`](#rowstack) - must be used inside a `RowLayout`
- [Tile](#tile) - must be used inside a `TileGrid` or `RowSectionContent`

For example:

```jsx
<PageLayout>
  <PageHeader>
    <PageHeaderTitle>MC-031</PageHeaderTitle>
    <PageHeaderMeta>CA-07 vs cam_classic · nominal sweep</PageHeaderMeta>
  </PageHeader>

  <StatStrip>...</StatStrip>

  <RowLayout>
    <RowSection size="wide" variant="boxed">...</RowSection>
    <RowSection size="narrow" variant="panel">...</RowSection>
  </RowLayout>

  <RowLayout>
    <RowSection variant="bar">...</RowSection>
  </RowLayout>
</PageLayout>
```

## Component Taxonomy

### `PageLayout`

A page container component that should be used as the top level for all pages. Every other component should fall under this component.

Renders a `<div>` with the following additional props:

| Prop | Values | Default | Description |
|---|---|---|---|
| `width` | `"full"` \| `"contained"` | `"full"` | `full` spans the window. `contained` centres the content at a max width of `80rem` with roomier padding (Home). |

```tsx
<PageLayout>
  // Any components
  ...
</PageLayout>
```

### `PageSidebar`

A left-hand sidebar for navigating between items of the same kind. When used, it **must be a direct child** of `PageLayout`.

Renders an `<aside>` with its default props and can hold the following components:

| Component | Extra props | Description |
|---|---|---|
| `PageSidebarGroup` | — | A titled block of links. Space between groups is automatically applied. |
| `PageSidebarLabel` | `count?: number` | A small uppercase heading of the group. `count` shows a number on the right side of the label row. |

Example usage:

```jsx
<PageLayout>
  <PageSidebar>
    <PageSidebarGroup>
      <PageSidebarLabel count={agents.length}>Agents</PageSidebarLabel>
      {agents.map((a) => (
        <Link
          key={a.id}
          to="/agents/$agentId"
          params={{ agentId: a.id }}
          className="rounded-md px-2 py-1.5 font-mono text-[13px]"
          activeProps={{ className: "bg-accent text-text" }}
          inactiveProps={{ className: "text-text-dim hover:text-text" }}
        >
          {a.name}
        </Link>
      ))}
    </PageSidebarGroup>

    <PageSidebarGroup>
      <PageSidebarLabel>Environments</PageSidebarLabel>
      ...
    </PageSidebarGroup>
  </PageSidebar>

  <PageHeader>...</PageHeader>
  <RowLayout>...</RowLayout>
</PageLayout>
```

### `PageHeader`

A row at the top of a page to explain it's: status, identifier, what it is, and actions that can be taken (displayed on the right of the row).

Renders a `<div>` with its default props and can hold the following components:

| Part | Renders | Description |
|---|---|---|
| `PageHeaderTitle` | `<h1>` | Represents the identifier (name of the page/item on it). |
| `PageHeaderMeta` | `<span>` | A small description for calling out key information. |
| `PageHeaderActions` | `<div>` | Available actions for the page, aligned to the right of the row. Often contains of switchers or buttons. |
| `PageHeaderDescription` | `<p>` | A full-width description to explain the page. |

Example usage:

```jsx
<PageHeader>
  <Badge variant="secondary">COMPLETE</Badge>

  <PageHeaderTitle>
    <span className="size-2.75 rounded-xs bg-run-1" />
    MC-031
  </PageHeaderTitle>

  <PageHeaderMeta>
    CA-07 vs cam_classic · nominal sweep · 2,000 episodes · 31 min
  </PageHeaderMeta>
  <PageHeaderActions>
    <JobSwitcher />
    <Button>Export</Button>
  </PageHeaderActions>

  <PageHeaderDescription>
    velora-agents 2.4.1 · commit 9f3c2e1 · trained on debris-field-v3
  </PageHeaderDescription>
</PageHeader>
```

### `RowLayout`

A container for a single row of components. Accepts [`RowSection`](#rowsection)s and [`RowStack`](#rowstack)s as children.

Renders a `<div>` with its default props.

Example usage:

```jsx
<RowLayout>
  <RowSection size="wide" variant="boxed">...</RowSection>
  <RowSection size="narrow" variant="panel">...</RowSection>
</RowLayout>

<RowLayout>
  <RowStack>
    <RowSection variant="panel">...</RowSection>
    ...
  </RowStack>
</RowLayout>
```

### `RowSection`

A single section of a [`RowLayout`](#rowlayout) or [`RowStack`](#rowstack).

Renders a `<section>` with the following additional props:

| Prop | Values | Default | Description |
|---|---|---|---|
| `size` | `"wide"` \| `"wider"` \| `"half"` \| `"narrow"` \| `"full"` | `"full"` | Its share of the row (see [`size`](#size)). Leave it as default inside a `RowStack`. |
| `variant` | `"plain"` \| `"boxed"` \| `"panel"` \| `"bar"` \| `"viewport"` | `"plain"` | The inner component style. The header styles itself to match (see [`variant`](#variant)). |

And can hold the following components:

| Component | Renders | Description |
|---|---|---|
| `RowSectionHeader` | `<div>` | A title and action, spaced apart. |
| `RowSectionTitle` | `<h2>` | A section title. Can be used without a header (styled as a small label, for example). |
| `RowSectionAction` | `<div>` | Sits on the right-hand side of the header. Useful for a hint, a count, a link or toggles. |
| `RowSectionContent` | `<div>` | The body of the row. |

Example usage:

```jsx
// Chart
<RowSection size="wide" variant="boxed">
  <RowSectionHeader>
    <RowSectionTitle>Coverage map · success rate (%)</RowSectionTitle>
    <RowSectionAction>
      <Segmented options={["Success %", "Median miss"]} active="Success %" />
    </RowSectionAction>
  </RowSectionHeader>
  <RowSectionContent>
    <CoverageGrid />
  </RowSectionContent>
</RowSection>

// Table: rows sit flush to the card edges, so give them their own px-4
<RowSection size="narrow" variant="bar">
  <RowSectionHeader>
    <RowSectionTitle>CA-07 vs classical baseline</RowSectionTitle>
    <RowSectionAction>7 metrics</RowSectionAction>
  </RowSectionHeader>
  <RowSectionContent>
    <Table>...</Table>
  </RowSectionContent>
</RowSection>

// A detail card whose title is styled as a small label
<RowSection size="narrow" variant="panel">
  <RowSectionContent className="flex flex-col gap-3">
    <RowSectionTitle className="text-[11px] font-medium tracking-[0.08em] text-text-mute uppercase">
      Selected cell
    </RowSectionTitle>
    ...
  </RowSectionContent>
</RowSection>

// 3D view: the header floats over the canvas
<RowSection size="wide" variant="viewport">
  <RowSectionHeader>
    <RowSectionTitle>CA-0419 · t+142 s</RowSectionTitle>
    <RowSectionAction><LiveDot status="running" /></RowSectionAction>
  </RowSectionHeader>
  <RowSectionContent className="aspect-video">
    <SceneCanvas />
  </RowSectionContent>
</RowSection>
```

#### `size`

The `size` of the children decides the split. Recommended pairing:

| Pair | Split |
|---|---|
| `wide` + `narrow` | about 60 / 40 |
| `wider` + `narrow` | about 70 / 30 |
| `half` + `half` | 50 / 50 |
| `full` | one component across the row |

#### `variant`

The `variant` style differs depending on selection:

| Variant | Looks like |
|---|---|
| `plain` | No border, background or padding; header sits above the content |
| `boxed` | Border and inner padding; header inside |
| `panel` | As `boxed`, on a raised panel background |
| `bar` | Border, header in a filled bar, no inner padding (content runs edge to edge) |
| `viewport` | Border, dark background, no inner padding; header floats over the content |

### `RowStack`

A column of several sections that takes one slot in a row, like a [`RowSection`](#rowsection). Must be used inside a [`RowLayout`](#rowlayout).

Renders a `div` with its default props.

Example usage:

```jsx
// A 3D view with two cards stacked beside it
<RowLayout>
  <RowSection size="wide" variant="viewport">...</RowSection>

  <RowStack>
    <RowSection variant="panel">
      <RowSectionHeader>
        <RowSectionTitle>Policy</RowSectionTitle>
      </RowSectionHeader>
      <RowSectionContent>…</RowSectionContent>
    </RowSection>

    <RowSection variant="bar">
      <RowSectionHeader>
        <RowSectionTitle>Events</RowSectionTitle>
      </RowSectionHeader>
      <RowSectionContent>…</RowSectionContent>
    </RowSection>
  </RowStack>
</RowLayout>
```

### `StatStrip`

Summary numbers in one bordered strip, divided by hairlines. Fits as many columns of at least `150px` width. Depending on screen size, can often fit four - seven stats at once.

Renders a `<dl>` with its default props and can hold the following components:

| Component | Renders | Extra props | Description |
|---|---|---|---|
| `Stat` | `<div>` | — | One cell. |
| `StatLabel` | `<dt>` | — | What the number is. |
| `StatValue` | `<dd>` | `tone?: "nominal" \| "warn" \| "alarm" \| "live" \| "model" \| "neutral"` | The number, in mono, coloured by `tone`.  Defaults to `"neutral"` |
| `StatHint` | `<dd>` | — | Optional muted line under the number. |

Example usage:

```jsx
<StatStrip>
  <Stat>
    <StatLabel>Runs</StatLabel>
    <StatValue>2,000</StatValue>
    <StatHint>100 cells × 20</StatHint>
  </Stat>
  <Stat>
    <StatLabel>Success</StatLabel>
    <StatValue tone="nominal">77.8%</StatValue>
    <StatHint>miss ≥ 150 m, no limit breached</StatHint>
  </Stat>
  <Stat>
    <StatLabel>Fail</StatLabel>
    <StatValue tone="alarm">10.2%</StatValue>
  </Stat>
</StatStrip>

// From data
<StatStrip>
  {stats.map((s) => (
    <Stat key={s.label}>
      <StatLabel>{s.label}</StatLabel>
      <StatValue tone={s.tone}>{s.value}</StatValue>
      {s.hint && <StatHint>{s.hint}</StatHint>}
    </Stat>
  ))}
</StatStrip>
```

### `Callout`

A tinted strip for something that needs noticing. E.g., a run in progress, an out of spec warning, or a neutral toolbar. For a clickable callout, use [`CalloutLink`](#calloutlink).

Renders a `<div>` with the following additional props:

| Prop | Values | Default | Description |
|---|---|---|---|
| `tone` | `"live"` \| `"warn"` \| `"alarm"` \| `"neutral"` | `"neutral"` | `live` is a green tint; `warn` and `alarm` add a coloured left edge; `neutral` is a panel-coloured strip. |

And can hold the following components:

| Component | Renders | Extra props | Description |
|---|---|---|---|
| `CalloutTitle` | `<span>` | `tone?: "live" \| "warn" \| "alarm" \| "neutral"` | A title for the callout. Takes its colour from the surrounding `Callout` or `CalloutLink`; set `tone` only to override it. |
| `CalloutDescription` | `<span>` | — | The detail text. |

Example usage:

```jsx
// Only description
<Callout tone="alarm" className="rounded-md px-3 py-2.5 text-[12.5px]">
  <CalloutDescription>
    Randomised debris mass ×1.18 is outside the ×0.90–1.10 spec for every episode in this env.
    Failures here are most likely a config bug, not the policy.
  </CalloutDescription>
</Callout>

// All children
<Callout tone="warn">
  <CalloutTitle>Out of spec</CalloutTitle>
  <CalloutDescription>REQ-CA-01 and REQ-CA-03 are not met in this campaign.</CalloutDescription>
</Callout>

// With custom components
<Callout>
  <Segmented options={["All", "Failing"]} active="All" />
  <CalloutDescription className="ml-auto">64 envs · 2.1k steps/s</CalloutDescription>
</Callout>
```

#### `CalloutLink`

A clickable callout using TanStack Router's `Link` with the callout styles.

Renders an `<a>` with the following additional props:

| Prop | Values | Default | Description |
|---|---|---|---|
| `tone` | `"live"` \| `"warn"` \| `"alarm"` \| `"neutral"` | `"neutral"` | Identical to `Callout`. |

It also takes every `Link` prop (`to`, `params`, `search`, `hash`, `preload`, `activeProps`, etc.), with the same type checking as `Link`.

Example usage:

```jsx
<CalloutLink tone="live" to="/live">
  <CalloutTitle>
    <LiveDot status="running" />
    RUNNING
  </CalloutTitle>
  <span className="font-mono">MC-032</span>
  <CalloutDescription>Campaign · CA-08 candidate · episode 383 / 2,000 · 64 envs · ~1.5 h left</CalloutDescription>
  <span className="ml-auto inline-flex items-center gap-1 text-nominal-fg">
    Watch a live episode
    <ArrowRight className="size-3.5" aria-hidden />
  </span>
</CalloutLink>
```

### `TileGrid`

A responsive grid that fits as many columns of at least `240px` width. Usually placed inside a `RowSectionContent` in a [`RowSection`](#rowsection).

Renders a `<div>` with its default props and accepts [`Tile`](#tile)s (read-only) or [`TileLink`](#tilelink)s (for clickable tiles) as children.

Example usage:

```jsx
// Readonly
<RowSection variant="boxed">
  <RowSectionHeader>
    <RowSectionTitle>Randomised parameters</RowSectionTitle>
    <RowSectionAction>{params.length} parameters</RowSectionAction>
  </RowSectionHeader>
  <RowSectionContent>
    <TileGrid>
      {params.map((p) => (
        <Tile key={p.name}>
          <span className="font-mono text-sm">{p.name}</span>
          <span className="font-mono text-xs text-text-dim">{p.range}</span>
          <span className="text-xs text-text-mute">{p.distribution}</span>
        </Tile>
      ))}
    </TileGrid>
  </RowSectionContent>
</RowSection>

// Clickable Links
<RowSection size="wide">
  <RowSectionHeader>
    <RowSectionTitle>Running now</RowSectionTitle>
    <RowSectionAction>3</RowSectionAction>
  </RowSectionHeader>
  <RowSectionContent>
    <TileGrid>
      {runs.map((r) => (
        <TileLink key={r.id} to="/live">
          ...
        </TileLink>
      ))}
    </TileGrid>
  </RowSectionContent>
</RowSection>
```

Need wider columns for tiles with more content? Style accordingly:

```jsx
<TileGrid className="grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
  {checkpoints.map((c) => (
    <Tile key={c.id} variant="ghost">
      ...
    </Tile>
  ))}
</TileGrid>
```

### `Tile`

A content block inside a [`TileGrid`](#tilegrid) or a `RowSectionContent` in a [`RowSection`](#rowsection). For a clickable tile, use [`TileLink`](#tilelink).

Renders a `<div>` with the following additional props:

| Prop | Values | Default | Description |
|---|---|---|---|
| `variant` | `"panel"` \| `"ghost"` \| `"list"` | `"panel"` | `panel` is filled; `ghost` is border only; `list` is one bordered box whose children are rows divided by hairlines. |
| `interactive` | `boolean` | `false` | Brightens the border on hover. Active by default on `TileLink` |

Variant options:

| Variant | Style format | Suitable for |
|---|---|---|
| `panel` | A bordered block on the raised panel background, with inner padding; its children stack vertically. | A `TileGrid`, or a vertical stack |
| `ghost` | A bordered block with no background, with inner padding and slightly tighter spacing between its children. | A `TileGrid` |
| `list` | A bordered block with no inner padding; its children are rows divided by hairlines and bring their own padding. | On its own, one per section |

#### `TileLink`

A clickable tile using TanStack Router's `Link` with the tile styles and the hover state built in.

Renders an `<a>` with the following additional props:

| Prop | Values | Default | Description |
|---|---|---|---|
| `variant` | `"panel"` \| `"ghost"` | `"panel"` | `panel` is filled; `ghost` is border only. |

It also takes every `Link` prop (`to`, `params`, `search`, `hash`, `preload`, `activeProps`, etc.) with the same type checking as `Link`.

Example usage:

```tsx
<RowSection size="wide">
  <RowSectionHeader>
    <RowSectionTitle>Running now</RowSectionTitle>
    <RowSectionAction>sim pool 128 envs · 112 in use</RowSectionAction>
  </RowSectionHeader>
  <RowSectionContent>
    <TileGrid>
      {running.map((r) => (
        <TileLink key={r.id} to="/live">
          <span className="flex items-center justify-between gap-2">
              <span className="font-mono text-sm">{r.id}</span>
              <Badge variant="secondary">{r.kind}</Badge>
          </span>
          <span className="text-[13px]">{r.name}</span>
          <Sparkline points={r.line} />
          <Progress value={r.pct} />
          <span className="text-xs text-muted-foreground">{r.sub}</span>
        </TileLink>
      ))}
    </TileGrid>
  </RowSectionContent>
</RowSection>
```
