const a={name:"ColorPalette",template:`
    <div style="font-family: Inter, sans-serif; padding: 32px; background: #fff; color: #181d27;">
      <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Design Tokens — Color Palette</h1>
      <p style="color: #717680; margin-bottom: 40px;">All CSS custom properties defined in style.css for the TeraERP design system.</p>

      <section v-for="group in colorGroups" :key="group.name" style="margin-bottom: 40px;">
        <h2 style="font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #535862; margin-bottom: 16px;">
          {{ group.name }}
        </h2>
        <div style="display: flex; flex-wrap: wrap; gap: 12px;">
          <div
            v-for="swatch in group.colors"
            :key="swatch.name"
            style="width: 140px;"
          >
            <div
              :style="{ background: swatch.value, height: '56px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.08)' }"
            />
            <p style="font-size: 12px; font-weight: 600; margin: 6px 0 2px;">{{ swatch.label }}</p>
            <p style="font-size: 11px; color: #717680; font-family: monospace;">{{ swatch.value }}</p>
          </div>
        </div>
      </section>

      <hr style="border: none; border-top: 1px solid #e9eaeb; margin: 40px 0;" />

      <section style="margin-bottom: 40px;">
        <h2 style="font-size: 16px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #535862; margin-bottom: 16px;">
          Typography Scale
        </h2>
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div v-for="t in typography" :key="t.label">
            <p :style="{ fontSize: t.size, fontWeight: t.weight, color: '#181d27', margin: 0 }">{{ t.label }}</p>
            <p style="font-size: 11px; color: #717680; font-family: monospace; margin: 2px 0 0;">{{ t.size }} / weight {{ t.weight }} — .{{ t.class }}</p>
          </div>
        </div>
      </section>
    </div>
  `,setup(){return{colorGroups:[{name:"Primary",colors:[{label:"primary-25",value:"#f0f3fa"},{label:"primary-50",value:"#e1e7f4"},{label:"primary-100",value:"#cbd4ec"},{label:"primary-200",value:"#a2b3dd"},{label:"primary-300",value:"#7992ce"},{label:"primary-400",value:"#5373c0"},{label:"primary-500",value:"#3f5fac"},{label:"primary-600",value:"#375295"},{label:"primary-700",value:"#2c4277"},{label:"primary-800",value:"#21315a"},{label:"primary-900",value:"#16213c"},{label:"primary-950",value:"#0b101e"}]},{name:"Gray",colors:[{label:"gray-25",value:"#fdfdfd"},{label:"gray-50",value:"#fafafa"},{label:"gray-100",value:"#f5f5f5"},{label:"gray-200",value:"#e9eaeb"},{label:"gray-300",value:"#d5d7da"},{label:"gray-400",value:"#a4a7ae"},{label:"gray-500",value:"#717680"},{label:"gray-600",value:"#535862"},{label:"gray-700",value:"#414651"},{label:"gray-800",value:"#252b37"},{label:"gray-900",value:"#181d27"},{label:"gray-950",value:"#0a0d12"}]},{name:"Success",colors:[{label:"success-25",value:"#f6fef9"},{label:"success-50",value:"#ecfdf3"},{label:"success-100",value:"#d1fadf"},{label:"success-200",value:"#a6f4c5"},{label:"success-300",value:"#6ce9a6"},{label:"success-400",value:"#32d583"},{label:"success-500",value:"#12b76a"},{label:"success-600",value:"#039855"},{label:"success-700",value:"#027948"},{label:"success-800",value:"#05603a"},{label:"success-900",value:"#054f31"}]},{name:"Warning",colors:[{label:"warning-25",value:"#fffcf5"},{label:"warning-50",value:"#fffaeb"},{label:"warning-100",value:"#feefc7"},{label:"warning-200",value:"#fedf89"},{label:"warning-300",value:"#fec84b"},{label:"warning-400",value:"#fdb022"},{label:"warning-500",value:"#f79009"},{label:"warning-600",value:"#dc6803"},{label:"warning-700",value:"#b54708"},{label:"warning-800",value:"#93370d"},{label:"warning-900",value:"#792e0d"}]},{name:"Danger",colors:[{label:"danger-25",value:"#fffbfa"},{label:"danger-50",value:"#fef3f2"},{label:"danger-100",value:"#fee4e2"},{label:"danger-200",value:"#fecdca"},{label:"danger-300",value:"#fda29b"},{label:"danger-400",value:"#f97066"},{label:"danger-500",value:"#f04438"},{label:"danger-600",value:"#d92d20"},{label:"danger-700",value:"#b32318"},{label:"danger-800",value:"#912018"},{label:"danger-900",value:"#7a271a"}]}],typography:[{label:"Heading Title",size:"18px",weight:"700",class:"heading-title"},{label:"Screen Header Name",size:"16px",weight:"500",class:"screen-header-name"},{label:"Subheading Title",size:"16px",weight:"400",class:"subheading-title"},{label:"Dialog Heading",size:"24px",weight:"500",class:"dialog-heading-title"},{label:"Dialog Subheading",size:"16px",weight:"300",class:"dialog-subheading-title"}]}}},s={title:"Design System/Design Tokens",component:a,parameters:{layout:"fullscreen",controls:{disable:!0},actions:{disable:!0}}},e={render:()=>a};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => ColorPalette
}`,...e.parameters?.docs?.source}}};const t=["ColorAndTypography"];export{e as ColorAndTypography,t as __namedExportsOrder,s as default};
