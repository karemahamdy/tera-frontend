<template>
  <div class="grid grid-cols-2 gap-3 mt-5">
    <div class="p-5 bg-primary-50 border border-primary-400 rounded-xl">
      <p>
        <strong>{{ $t("itemHold.holdTypesTitle") }}</strong>
      </p>

      <div class="px-5 text-sm mt-2 space-y-1">
        <p>
          <strong>{{ $t("itemHold.qcHoldLabel") }} </strong>
          {{ $t("itemHold.qcHoldDescription") }}
        </p>

        <p>
          <strong>{{ $t("itemHold.reservationLabel") }} </strong>
          {{ $t("itemHold.reservationDescription") }}
        </p>

        <p>
          <strong>{{ $t("itemHold.damageHoldLabel") }} </strong>
          {{ $t("itemHold.damageHoldDescription") }}
        </p>

        <p>
          <strong>{{ $t("itemHold.investigationLabel") }} </strong>
          {{ $t("itemHold.investigationDescription") }}
        </p>
      </div>
    </div>

    <div class="p-5 bg-warning-50 border border-warning-400 rounded-xl">
      <p>
        <strong>{{ $t("itemHold.importantNotesTitle") }}</strong>
      </p>

      <div class="px-5 text-sm mt-2 space-y-1">
        <p>• {{ $t("itemHold.note1") }}</p>
        <p>• {{ $t("itemHold.note2") }}</p>
        <p>• {{ $t("itemHold.note3") }}</p>
      </div>
    </div>
  </div>
</template>
