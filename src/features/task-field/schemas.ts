import z from "zod";

const customTaskFieldKinds = [
  "Text",
  "Date",
  "People",
  "Number",
  "Percent",
  "Currency",
  "Checkbox",
  "Dropdown",
  "Email",
  "Phone",
  "URL",
] as const;

type StringListType = typeof customTaskFieldKinds;

type Indices = keyof StringListType;

export type CustomTaskFieldKinds = StringListType[Indices];

const currencySettingsSchema = z
  .object({
    defaultCurrency: z.string(),
    displayFormat: z.string(), // IsoCodeAfter EuroSymbolAfterWithSpace EuroSymbolAfterNoSpace EuroSymbolBeforeWithSpace EuroSymbolBeforeNoSpace
    displayIntegerDecimalFormat: z.number(),
  })
  .optional();

const dropdownSettingsSchema = z
  .object({
    allowMultiple: z.boolean(),
    options: z.array(z.object({ id: z.string(), value: z.string() })),
    defaultValue: z.string().nullable(),
  })
  .optional();

const numberSettingsSchema = z
  .object({
    displayIntegerDecimalPlacesFormat: z.number(),
    displayFloatDecimalPlacesFormat: z.number(),
  })
  .optional();

const peopleSettingsSchema = z
  .object({
    allowMultiple: z.boolean(),
  })
  .optional();

const percentSettingsSchema = z
  .object({
    displayIntegerDecimalPlacesFormat: z.number(),
    displayFloatDecimalPlacesFormat: z.number(),
  })
  .optional();

const phoneSettingsSchema = z
  .object({
    defaultCountryCode: z.string(),
  })
  .optional();

const createCustomTaskFieldSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  visibility: z.enum(["HIDDEN", "VISIBLE"]),
  kind: z.enum(customTaskFieldKinds),
  currencySettingsSchema,
  dropdownSettingsSchema,
  numberSettingsSchema,
  peopleSettingsSchema,
  percentSettingsSchema,
  phoneSettingsSchema,
});

const updateCustomTaskFieldSchema = z.object({
  name: z.string().trim().min(1, "Name is required").optional(),
  visibility: z.enum(["HIDDEN", "VISIBLE"]),
  currencySettingsSchema,
  dropdownSettingsSchema,
  numberSettingsSchema,
  peopleSettingsSchema,
  percentSettingsSchema,
  phoneSettingsSchema,
});

export {
  createCustomTaskFieldSchema,
  updateCustomTaskFieldSchema,
  currencySettingsSchema,
  dropdownSettingsSchema,
  numberSettingsSchema,
  peopleSettingsSchema,
  percentSettingsSchema,
  phoneSettingsSchema,
};
