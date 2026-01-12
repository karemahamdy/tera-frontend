export function mapFiltersToBody(filters: any[]) {
  const body: Record<string, any> = {};
  filters.forEach((filter) => {
    if (!filter.value) return;
    if (Array.isArray(filter.value)) {
      body[filter.field + "Ids"] = filter.value.map((v : any) => v.value ?? v);
    } else {
      body[filter.field] = filter.value;
    }
  });
  return body;
}
