# Purchase Waybill Feature

A multi-step wizard for receiving goods from a supplier. Supports **Create**, **View**, and **Edit** modes.

---

## Module Structure

```
purchase-waybill/
├── pages/
│   └── PurchaseWaybillForm.vue       # Main page — orchestrates the stepper
├── components/
│   ├── SupplierDetails.vue           # Step 1: Supplier & currency info
│   ├── WarehouseDetails.vue          # Step 2: Receiving warehouse & zone
│   ├── LineItems.vue                 # Step 3: Items, quantities, prices
│   └── Payment.vue                   # Step 4: Payment terms & transaction summary
├── services/
│   └── PurchaseWaybill.service.ts    # API calls (CRUD)
├── composables/
│   └── usePurshace.ts                # Composable wrapping the service
├── types/
│   └── PurchaseWaybill.ts            # TypeScript interfaces
└── routes.ts                         # Route definitions
```

---

## Routes

| Name | Path | Mode |
|---|---|---|
| `PurchaseWaybillCreate` | `/purchase-waybill/create` | create |
| `PurchaseWaybillView` | `/purchase-waybill/:id/view` | view |
| `PurchaseWaybillEdit` | `/purchase-waybill/:id/edit` | edit |

All three routes are handled by the **same component** (`PurchaseWaybillForm.vue`), which detects the mode via `route.name`.

---

## How Modes Work

```js
const mode = computed(() => {
  if (route.name === 'PurchaseWaybillView') return 'view';
  if (route.name === 'PurchaseWaybillEdit') return 'edit';
  return 'create';
});
```

| Mode | Fields | StepperActions | Edit Button |
|---|---|---|---|
| `create` | Editable | Shown ("Create") | Hidden |
| `view` | Disabled | Hidden | Shown |
| `edit` | Editable | Shown ("Update") | Hidden |

---

## The `dataReady` Pattern (Key Design Decision)

**Problem:** Children need to initialize their local form state from props — but in edit/view mode, props arrive *asynchronously* (after `onMounted` fetches the API).

**Solution:** Children only mount *after* data is ready.

```js
// PurchaseWaybillForm.vue
const dataReady = computed(() => !id.value || !!formData.value.supplierDetails);
```

```html
<div v-if="!dataReady">
  <ProgressSpinner />    <!-- shows while loading -->
</div>
<template v-else>
  <SupplierDetails ... />
  <WarehouseDetails ... />
  ...
</template>
```

- **Create mode** (`!id`): `dataReady = true` immediately → children mount right away
- **Edit/View mode** (`id` present): `dataReady` becomes `true` only after `fetchPurchaseWaybillById` resolves → children mount with populated props

This eliminates the need for watchers in all child components.

---

## Step Components

### Design: No Watchers

Each step component uses a single `reactive` form initialized directly from props:

```js
const form = reactive({
  supplierId: props.supplierDetails?.supplierId ?? null,
  waybillDate: props.supplierDetails?.waybillDate
    ? new Date(props.supplierDetails.waybillDate) : null,
  // ...
});
```

Because the parent's `dataReady` guard ensures children mount **after** props are populated, there is no need for `watch(() => props.xxx, ...)` to handle async arrival.

Changes are emitted via a single `emitUpdate()` function:
```js
function emitUpdate() {
  if (props.disabled) return;   // no-op in view mode
  emit('update', { ... });
}
```

### Performance: `@blur` for Text Inputs

Text inputs bind locally via `v-model` and emit to parent only on `@blur` (when the user leaves the field), preventing a re-render chain per keystroke:

```html
<FormInput v-model="form.waybillNumber" @blur="emitUpdate" />
```

Dropdowns and date pickers emit immediately on selection via `@update:modelValue`:
```html
<FormDropdown :modelValue="form.supplierId"
  @update:modelValue="(v) => { form.supplierId = v; emitUpdate(); }" />
```

---

### Step 1 — `SupplierDetails.vue`

Collects supplier info and currency/exchange-rate details.

**Fields:** Waybill Number (auto-fetched), Supplier (dropdown), Supplier Sales Order, PO Reference, External Reference, Waybill Date, Expected Delivery, Currency (dropdown), Exchange Rate, Exchange Date.

**On create:** Calls `fetchNextNumber()` in `onMounted` to auto-populate the waybill number.

**View mode:** Supplier and Currency show as read-only `FormInput` instead of dropdowns.

---

### Step 2 — `WarehouseDetails.vue`

Selects the receiving warehouse and (if Professional type) a zone.

**Zone loading:**
```js
async function onWarehouseChange(val: string) {
  form.warehouseId = val;
  const wh = WarehouseLookups.value.find(w => w.value === val);
  if (wh?.type === 'Professional') {
    await getZonesLookups(val);   // load zones dynamically
  } else {
    form.zoneId = null;
  }
  emitUpdate();
}
```

Zone selector only appears when the selected warehouse is of type `Professional`.

---

### Step 3 — `LineItems.vue`

Table-based line item editor. Each row has item, quantity, UOM, warehouse, zone, unit price, tax, and calculated total.

**Total calculation (inline, no watcher):**
```js
function calcTotal(qty, price, tax) {
  const sub = qty * price;
  return sub + (sub * tax) / 100;
}

// Called directly in @change handler:
@change="(e) => {
  const v = Number(e.target.value) || 0;
  data.quantity = v;
  data.total = calcTotal(v, data.unitPrice, data.tax);
  emitUpdate();
}"
```

**Serial tracking:** Tracked items open a `QuantitySerialDialog` instead of an inline input.

**UOM:** Multiple units (if available) shown as a `<select>`. On change, `unitId` is updated from `unitOptionsMap`.

**`unitId` from edit mode:** `mapApiItem()` copies `unitId` from the API response so it's preserved in the payload on update.

---

### Step 4 — `Payment.vue`

Payment type (Payable/Cash), payment terms, import type, Incoterms, and notes/comments. Also embeds `TransactionSummary`.

`TransactionSummary` receives `subTotal`, `totalTax`, `grandTotal` from the `form` reactive object (initially from `props.paymentInfo`).

---

## Data Flow

```
PurchaseWaybillForm.vue (formData ref)
    │
    ├── GET /PurchaseWaybills/:id ──► formData = result (edit/view mode)
    │
    ├── dataReady becomes true
    │
    ├──[mounts]──► SupplierDetails   ─── @update ──► updateSupplierData()
    ├──[mounts]──► WarehouseDetails  ─── @update ──► updateWarehouseData()
    ├──[mounts]──► LineItems         ─── @update ──► updateLineItemsData()
    └──[mounts]──► Payment           ─── @update ──► updatePaymentData()
                                                         │
                                                    formData updated
                                                    (used only at submit)
```

---

## Submit Payload

```js
{
  supplierDetails: { waybillNumber, supplierId, waybillDate, ... },
  paymentTerms: { currencyId, exchangeRate, rateDate },
  warehouseDetails: { warehouseId, zoneId },
  lineItems: [
    { itemId, quantity, unitId, unitPrice, unitTaxPercent, lineTotal, warehouseId, zoneId }
  ],
  paymentInfo: {
    paymentType, paymentTermId, purchaseType, incoterm,
    subTotal, totalTax, globalDiscount, grandTotal,
    // Base amounts computed before sending:
    subTotalBase:      subTotal      × exchangeRate,
    taxAmountBase:     totalTax      × exchangeRate,
    discountAmountBase:globalDiscount× exchangeRate,
    grandTotalBase:    grandTotal    × exchangeRate,
  },
  notes: { comment1..5 }
}
```

> The API validates that `*Base` fields equal their counterpart × `exchangeRate`, so these are computed in-place in the `submit()` function.

---

## API Endpoints

| Method | URL | Purpose |
|---|---|---|
| `GET` | `/PurchaseWaybills/NextNumber` | Auto-generate waybill number |
| `POST` | `/PurchaseWaybills` | Create |
| `GET` | `/PurchaseWaybills/:id` | Fetch by ID (view/edit) |
| `PUT` | `/PurchaseWaybills/:id` | Update |
